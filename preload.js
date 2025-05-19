const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onSQLLog: (cb) => ipcRenderer.on('sql-log', (_, data) => cb(data)),
  selectLogFile: () => ipcRenderer.invoke('select-log-file')
});