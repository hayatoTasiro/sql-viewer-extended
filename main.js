const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  // ファイルオープンダイアログ
  ipcMain.handle('select-log-file', async () => {
    const result = await dialog.showOpenDialog(win, {
      properties: ['openFile'],
      filters: [{ name: 'SQL Logs', extensions: ['log', 'txt', 'sql'] }]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }

    const content = fs.readFileSync(result.filePaths[0], 'utf-8');
    return { canceled: false, content };
  });
}

app.whenReady().then(() => {
  createWindow();
});
