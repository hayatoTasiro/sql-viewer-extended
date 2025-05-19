const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const { format } = require('sql-formatter');

let mainWindow;
let watcher = null;
let lastSize = 0;
let logPath = null;

function stripSchema(sql) {
  return sql.replace(/"public"\./g, '').replace(/\s+/g, ' ');
}

function watchFile(filePath) {
  if (watcher) watcher.close();
  lastSize = 0;
  logPath = filePath;
  watcher = chokidar.watch(logPath).on('change', () => {
    const stats = fs.statSync(logPath);
    const newSize = stats.size;

    if (newSize > lastSize) {
      const stream = fs.createReadStream(logPath, { start: lastSize, end: newSize });
      let buffer = '';
      stream.on('data', chunk => buffer += chunk.toString());
      stream.on('end', () => {
        const lines = buffer.trim().split('\n');
        for (const raw of lines) {
          const formatted = format(raw, { language: 'postgresql', indent: '  ' });
          const cleaned = stripSchema(formatted);
          mainWindow.webContents.send('sql-log', cleaned);
        }
      });
      lastSize = newSize;
    }
  });
}

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('index.html');
});

ipcMain.handle('select-log-file', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Log Files', extensions: ['log', 'txt'] }]
  });
  if (!result.canceled && result.filePaths.length > 0) {
    watchFile(result.filePaths[0]);
    return path.basename(result.filePaths[0]);
  }
  return null;
});