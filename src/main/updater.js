// @flow

import {
  autoUpdater,
  type ProgressInfo,
  type UpdateInfo,
} from 'electron-updater'
import { BehaviorSubject } from 'rxjs'

import type { Logger } from './logger'

export type UpdaterState =
  | {| status: 'idle' |}
  | {| status: 'checking' |}
  | {| status: 'error', error: Error |}
  | {| status: 'no-update' |}
  | {| status: 'update-available', info: UpdateInfo |}
  | {|
      status: 'update-downloading',
      info: UpdateInfo | null,
      progress: ProgressInfo,
    |}
  | {| status: 'update-downloaded', info: UpdateInfo, install: () => void |}

export type UpdaterSubject = BehaviorSubject<UpdaterState>

export const checkForUpdates = () => {
  autoUpdater.checkForUpdates().catch(() => {
    // Silence promise rejection - errors are listened to in setupUpdater()
  })
}

export const setupUpdater = (logger: Logger): UpdaterSubject => {
  const subject = new BehaviorSubject<UpdaterState>({ status: 'idle' })
  let updateInfo: UpdateInfo | null = null

  autoUpdater.autoInstallOnAppQuit = false
  autoUpdater.logger = logger.child({ context: 'system/updater' })

  autoUpdater.on('checking-for-update', () => {
    updateInfo = null
    subject.next({ status: 'checking' })
  })
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    updateInfo = info
    subject.next({ status: 'update-available', info })
  })
  autoUpdater.on('update-not-available', () => {
    updateInfo = null
    subject.next({ status: 'no-update' })
  })
  autoUpdater.on('error', (error: Error) => {
    updateInfo = null
    subject.next({ status: 'error', error })
  })
  autoUpdater.on('download-progress', (progress: ProgressInfo) => {
    subject.next({ status: 'update-downloading', info: updateInfo, progress })
  })
  autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
    updateInfo = null
    subject.next({
      status: 'update-downloaded',
      info,
      install: () => {
        autoUpdater.quitAndInstall()
      },
    })
  })

  autoUpdater.checkForUpdates()

  return subject
}
