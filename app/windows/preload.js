const { contextBridge, ipcRenderer } = require('electron');
const { store } = require('../store.js');

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
  },
  once: (channel, func) => {
    ipcRenderer.once(channel, (event, ...args) => func(event, ...args));
  },
  invoke: (channel, data) => {
    return ipcRenderer.invoke(channel, data);
  },
  removeListener: (channel, func) => {
    ipcRenderer.removeListener(channel, func);
  },
});

contextBridge.exposeInMainWorld('Store', {
  get: (key) => store.get(key),
  set: (key, value) => store.set(key, value),
  has: (key) => store.has(key),
  delete: (key) => store.delete(key),
  clear: () => store.clear(),
});

contextBridge.exposeInMainWorld('serialAPI', {
  connectToDevice: (device) => {
    ipcRenderer.send('connect-to-device', device);
  },
  onLogMessage: (callback) => {
    ipcRenderer.on('log-message', (_, message) => {
      callback(message);
    });
  },
});