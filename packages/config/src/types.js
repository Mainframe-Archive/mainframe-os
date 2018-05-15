// @flow

export type EnvPaths = {
  cache: string,
  config: string,
  data: string,
  log: string,
  temp: string,
}

export type InstallStatus =
  | 'unknown'
  | 'download_started'
  | 'download_failed'
  | 'download_complete'
  | 'checksum_failed'
  | 'checksum_complete'
  | 'installed'

export type RunStatus = 'starting' | 'running' | 'stopping' | 'stopped'
