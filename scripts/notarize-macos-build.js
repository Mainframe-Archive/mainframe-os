const { notarize } = require('electron-notarize')

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir, packager } = context
  if (electronPlatformName !== 'darwin') {
    return
  }

  const { appId, productFilename } = packager.appInfo
  return await notarize({
    appBundleId: appId,
    appPath: `${appOutDir}/${productFilename}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: `@keychain:AC_PASSWORD`,
    ascProvider: 'UVX454KX9P',
  })
}
