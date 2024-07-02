const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { autoUpdater } = require("electron-updater");
const isDev = require('electron-is-dev');

const userDocumentsPath = app.getPath('documents');
const prestineFolderPath = path.join(userDocumentsPath, 'Prestine');

if (!isDev && !fs.existsSync(prestineFolderPath)) {
  fs.mkdirSync(prestineFolderPath);
}

let mainWindow;

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    icon: path.join(app.getAppPath(), './dist/favicon.ico'),
    webPreferences: {
      preload: isDev 
        ? path.join(app.getAppPath(), './public/preload.js') 
        : path.join(app.getAppPath(), './dist/preload.js'),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
  });

  autoUpdater.checkForUpdatesAndNotify();

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist/index.html"));
  }

  if (isDev) {
    mainWindow.webContents.on('did-frame-finish-load', () => {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    });
  }
};

app.setPath(
  'userData',
  isDev
    ? path.join(app.getAppPath(), 'userdata/') 
    : path.join(process.resourcesPath, 'userdata/')
);

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Ok'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version is being downloaded.'
  };
  dialog.showMessageBox(dialogOpts, (response) => {});
});

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  autoUpdater.quitAndInstall();
});

process.on('uncaughtException', (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

require('./tickets');
require('./users');
require('./performance');
require('./services');
