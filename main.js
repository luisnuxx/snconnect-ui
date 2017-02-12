const electron = require('electron');


// Module to control application life.

const app = electron.app
const Menu = electron.Menu
const Tray = electron.Tray
const ipcMain = electron.ipcMain



// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const assetsDirectory = path.join(__dirname, 'assets')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//app.on('ready', createWindow)

app.on('ready', () => {

  //createTray()
  createWindow()


})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.




// TO CHECK



const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'icon.png_16x16.png'))
  tray.on('right-click', toggleWindow)
  tray.on('double-click', toggleWindow)
  tray.on('click', function (event) {
    toggleWindow()

    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
  })
}

const getWindowPosition = () => {
  const windowBounds = window.getBounds()
  const trayBounds = tray.getBounds()

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4)

  return {x: x, y: y}
}
/*
const createWindow = () => {
  window = new BrowserWindow({
    width: 300,
    height: 450,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false
    }
  })
  window.loadURL(`file://${path.join(__dirname, 'index.html')}`)

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide()
    }
  })
}
*/
const toggleWindow = () => {
  if (window.isVisible()) {
    window.hide()
  } else {
    showWindow()
  }
}

const showWindow = () => {
  const position = getWindowPosition()
  window.setPosition(position.x, position.y, false)
  window.show()
  window.focus()
}

ipcMain.on('show-window', () => {
  showWindow()
})

ipcMain.on('weather-updated', (event, weather) => {
  // Show "feels like" temperature in tray
  tray.setTitle(`${Math.round(weather.currently.apparentTemperature)}°`)

  // Show summary and last refresh time as hover tooltip
  const time = new Date(weather.currently.time).toLocaleTimeString()
  tray.setToolTip(`${weather.currently.summary} at ${time}`)

  // Update icon for different weather types
  switch (weather.currently.icon) {
    case 'cloudy':
    case 'fog':
    case 'partly-cloudy-day':
    case 'partly-cloudy-night':
      tray.setImage(path.join(assetsDirectory, 'cloudTemplate.png'))
      break
    case 'rain':
    case 'sleet':
    case 'snow':
      tray.setImage(path.join(assetsDirectory, 'umbrellaTemplate.png'))
      break
    case 'clear-night':
      tray.setImage(path.join(assetsDirectory, 'moonTemplate.png'))
      break
    case 'wind':
      tray.setImage(path.join(assetsDirectory, 'flagTemplate.png'))
      break
    case 'clear-day':
    default:
      tray.setImage(path.join(assetsDirectory, 'sunTemplate.png'))
  }
  })
