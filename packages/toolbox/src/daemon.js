// @flow

import type { DaemonConfig } from '@mainframe/config'
import type { ChildProcess } from 'child_process'
import execa from 'execa'

const execStartDaemon = (
  binPath: string,
  socketPath: string,
  detached: boolean = false,
) => {
  return execa(binPath, ['start', '--path', socketPath], { detached })
}

const execStopDaemon = (binPath: string) => {
  return execa(binPath, ['stop'])
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
    case 'stopped':
      // Return the child process as provided by execa
      return execStartDaemon(cfg.binPath, cfg.socketPath, detached)
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

  const status = cfg.runStatus
  switch (status) {
    case 'stopped':
      // OK, return without the process as it's been created elsewhere
      return
    case 'stopping':
      // Wait for existing process to be stopped
      return cfg.whenRunStatus('stopped')
    case 'starting':
      // Already being started by another process, just need to wait for it
      await cfg.whenRunStatus('running')
    case 'running':
      // Return the child process as provided by execa
      return execStopDaemon(cfg.binPath)
    default:
      throw new Error(`Unhandled daemon status: ${status}`)
  }
}
