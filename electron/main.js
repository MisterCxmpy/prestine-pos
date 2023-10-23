const { app, BrowserWindow } = require('electron')
const isDev = require("electron-is-dev");
const path = require("path")

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    webPreferences: {
      enableRemoteModule: true
    }
  })

  mainWindow.maximize()

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    const filePath = path.join(app.getAppPath(), "dist/index.html");
    mainWindow.loadFile(filePath);
  }
}

app.disableHardwareAcceleration()

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})