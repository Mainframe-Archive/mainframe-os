// Credit to: https://github.com/carlosperate/electron-sandbox/blob/master/sandbox-extended/preload-extended.js

const {ipcRenderer} = require('electron');

const flatten = (obj) => Object.keys(obj)
  .reduce((acc, key) => {
    const val = obj[key];
    return acc.concat(typeof val === 'object' ? flatten(val) : val);
  }, []);

/**
 * SafeIpcRenderer
 *
 * This class wraps electron's ipcRenderer an prevents
 * invocations to channels passed to the constructor. The instance methods
 * are all created in the constructor to ensure that the protect method
 * and validEvents array cannot be overridden.
 *
 */
class SafeIpcRenderer {
  constructor (events) {
    const validEvents = flatten(events);
    const protect = (fn) => {
      return (channel, ...args) => {
        if (!validEvents.includes(channel)) {
          throw new Error(`Blocked access to unknown channel ${channel} from the renderer.
                          Add channel to whitelist in preload.js in case it is legitimate.`);
        }
        return fn.apply(ipcRenderer, [channel].concat(args));
      };
    };
    this.on = protect(ipcRenderer.on);
    this.once = protect(ipcRenderer.once);
    this.removeListener = protect(ipcRenderer.removeListener);
    this.removeAllListeners = protect(ipcRenderer.removeAllListeners);
    this.send = protect(ipcRenderer.send);
    this.sendSync = protect(ipcRenderer.sendSync);
    this.sendToHost = protect(ipcRenderer.sendToHost);
  }
}

/*
   Modify the whitefilter here.
*/
window.ipc = new SafeIpcRenderer([
  "message",
]);
