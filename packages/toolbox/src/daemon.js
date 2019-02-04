// @flow

import { spawn, type ChildProcess } from 'child_process'
import type { DaemonConfig } from '@mainframe/config'
import execa from 'execa'

const execStartDaemon = (
  binPath: string,
  envName: string,
  detached: boolean = false,
): ChildProcess => {
  console.log(`Trying to start daemon with environment: ${envName}`)
  return spawn(binPath, ['start', `--env=${envName}`], { detached })
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
    console.log(
      `daemon: binPath arg was not null so config binPath set to ${binPath}`,
    )
  }
  if (socketPath != null) {
    cfg.socketPath = socketPath
    console.log(
      `daemon: socketPath arg was not null so config socketPath set to ${socketPath}`,
    )
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
      console.log('I think the daemon is already running')
      cfg.runStatus = 'starting'
      await stopDaemon(cfg)
      return execStartDaemon(cfg.binPath, cfg.env.name, detached)
    case 'starting':
      // Already being started by another process, just need to wait for it
      console.log('I think the daemon is already being started somehwere else')
      return cfg.whenRunStatus('running')
    case 'stopping':
      // Wait for existing process to be stopped before starting again
      console.log('I think the daemon is being stopped')
      await cfg.whenRunStatus('stopped')
    // eslint-disable-next-line no-fallthrough
    case 'stopped':
      // Return the child process as provided by execa
      console.log('I think the daemon is stopped, so I will try to start it')
      cfg.runStatus = 'starting'
      return execStartDaemon(cfg.binPath, cfg.env.name, detached)
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
      cfg.runStatus = 'stopping'
      return execStopDaemon(cfg.binPath, cfg.env.name)
    default:
      throw new Error(`Unhandled daemon status: ${status}`)
  }
}
