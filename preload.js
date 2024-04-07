const { contextBridge } = require('electron');
const os = require('os');
const path = require('path');
const Toastify = require('toastify-js');

// Sending node module to render process
contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
});

// Sending node module to render process
contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
});

// Sending node module to render process
contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast(),
});
