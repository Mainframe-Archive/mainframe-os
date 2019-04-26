// @flow

import { spawn, type ChildProcess } from 'child_process'
import type { DaemonConfig } from '@mainframe/config'
import execa from 'execa'

import { onDataMatch } from './utils'

const execStartDaemon = (
  binPath: string,
  envName: string,
  detached: boolean = false,
): Promise<ChildProcess> => {
  return new Promise((resolve, reject) => {
    const proc = spawn(binPath, ['start', `--env=${envName}`], { detached })
    const stopOut = onDataMatch(
      proc.stdout,
      `${envName} server started`,
      () => {
        stopOut()
        resolve(proc)
      },
    )
    const stopErr = onDataMatch(
      proc.stderr,
      `${envName} server failed to start`,
      () => {
        stopErr()
        reject(new Error('Server failed to start'))
      },
    )
  })
}

const execStopDaemon = (binPath: string, envName: string) => {
  return execa(binPath, ['stop', `--env=${envName}`])
}

export const setupDaemon = (
  cfg: DaemonConfig,
  {
    binPath,
    socketPath,
  }: {
    binPath?: string,
    socketPath?: string,
  },
): void => {
  if (binPath != null) {
    cfg.binPath = binPath
  }
  if (socketPath != null) {
    cfg.socketPath = socketPath
  }
}

export const startDaemon = async (
  cfg: DaemonConfig,
  detached: boolean = false,
): Promise<?ChildProcess> => {
  if (cfg.binPath == null) {
    throw new Error(
      'Missing Mainframe daemon binary path, call `setupDaemon()` to configure',
    )
  }
  if (cfg.socketPath == null) {
    throw new Error(
      'Missing Mainframe daemon socket path, call `setupDaemon()` to configure',
    )
  }

  const status = cfg.runStatus
  switch (status) {
    case 'running':
      // OK, return without the process as it's been created elsewhere
      return
    case 'starting':
      // Already being started by another process, just need to wait for it
      return cfg.whenRunStatus('running')
    case 'stopping':
      // Wait for existing process to be stopped before starting again
      await cfg.whenRunStatus('stopped')
    // eslint-disable-next-line no-fallthrough
    case 'stopped':
      // Return the child process as provided by execa
      cfg.runStatus = 'starting'
      return await execStartDaemon(cfg.binPath, cfg.env.name, detached)
    default:
      throw new Error(`Unhandled daemon status: ${status}`)
  }
}

export const stopDaemon = async (cfg: DaemonConfig): Promise<?ChildProcess> => {
  if (cfg.binPath == null) {
    throw new Error(
      'Missing Mainframe daemon binary path, call `setupDaemon()` to configure',
    )
  }
  if (cfg.socketPath == null) {
    throw new Error(
      'Missing Mainframe daemon socket path, call `setupDaemon()` to configure',
    )
  }

  const status = cfg.runStatus
  switch (status) {
    case 'stopped':
      // OK, return without the process as it's been created elsewhere
      return
    case 'stopping':
      // Wait for existing process to be stopped
      try {
        await cfg.whenRunStatus('stopped')
      } catch (err) {
        cfg.runStatus = status
      }
      return
    case 'starting':
      // Already being started by another process, just need to wait for it
      await cfg.whenRunStatus('running')
    // eslint-disable-next-line no-fallthrough
    case 'running':
      // Return the child process as provided by execa
      cfg.runStatus = 'stopped'
      return execStopDaemon(cfg.binPath, cfg.env.name)
    default:
      throw new Error(`Unhandled daemon status: ${status}`)
  }
}
