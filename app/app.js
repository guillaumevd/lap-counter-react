const { app, ipcMain, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater')
const Readline = require('@serialport/parser-readline');
const SerialPort = require('serialport');

//DISABLE UPDATER AUTO DOWNLOAD
autoUpdater.autoDownload = false;

//WINDOWS
const UpdateWindow = require("./windows/update");
const MainWindow = require("./windows/main");
//-------------------------------------------------

//VERIFICATIONS
const isDev = process.env.NODE_ENV === 'dev';
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
} else {
    app.whenReady().then(() => {
        UpdateWindow.createWindow();
    });
}
//-------------------------------------------------


//CONTEXT INTER PROCESS COMMUNICATION


//windows management
ipcMain.on('update-window-close', () => UpdateWindow.destroyWindow())
ipcMain.on('main-window-open', () => MainWindow.createWindow())
ipcMain.on('main-window-show', () => MainWindow.getWindow().show())
ipcMain.on('main-window-hide', () => MainWindow.getWindow().hide())
ipcMain.on('main-window-close', () => MainWindow.destroyWindow())
ipcMain.on('main-window-dev-tools', () => MainWindow.getWindow().webContents.openDevTools())
ipcMain.on('main-window-minimize', () => MainWindow.getWindow().minimize())
ipcMain.on('main-window-maximize', () => { if (MainWindow.getWindow().isMaximized()) { MainWindow.getWindow().unmaximize(); } else { MainWindow.getWindow().maximize(); } })
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
//------------------------------------


//update system process

ipcMain.handle('update-app', () => {
    return new Promise(async(resolve, reject) => {
        autoUpdater.checkForUpdates().then(() => {
            resolve();
        }).catch(error => {
            resolve({
                error: true,
                message: error
            })
        })
    })
})

autoUpdater.on('update-available', () => {
    const updateWindow = UpdateWindow.getWindow();
    if (updateWindow) updateWindow.webContents.send('updateAvailable');
});

ipcMain.on('start-update', () => {
    autoUpdater.downloadUpdate();
})

autoUpdater.on('update-not-available', () => {
    const updateWindow = UpdateWindow.getWindow();
    if (updateWindow) updateWindow.webContents.send('update-not-available');
});

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall();
});

autoUpdater.on('download-progress', (progress) => {
    const updateWindow = UpdateWindow.getWindow();
    if (updateWindow) updateWindow.webContents.send('download-progress', progress);
})

//------------------------------------

ipcMain.handle('fetch', async (event, url) => {
    return new Promise((resolve, reject) => {
        fetch(url).then(config => {
            return resolve(config.json());
        }).catch(error => {
            return reject(error);
        })
    })
});

const connectWithRetry = (event, device, maxRetries) => {
    let retries = 0;
    let isConnected = false;
  
    const tryConnect = () => {
      if (retries >= maxRetries) {
        event.sender.send('log-message', `Failed to connect to device ${device} after ${maxRetries} attempts. Retrying in 20seconds`);
        isConnected = false;
        retries = 0;
        setTimeout(tryConnect, 20000);
        return;
      }
  
      if (isConnected) {
        return;
      }
  
      retries += 1;
  
      const port = new SerialPort(device, { baudRate: 9600, autoOpen: false });
  
      port.open((err) => {
        if (err) {
          event.sender.send('log-message', `Error opening port ${device}: "${err.message}"`);
          isConnected = false;
          setTimeout(tryConnect, 3000);
          return;
        }
  
        event.sender.send('log-message', `Port opened for device: ${device}`);
      });
  
      port.on('open', () => {
        setTimeout(() => {
            port.write('c', (err) => { // Send the 'c' character to the device
                if (err) {
                  event.sender.send('log-message', `Error writing to port ${device}: "${err.message}"`);
                  isConnected = false;
                } else {
                  event.sender.send('log-message', `Successfully wrote to port ${device}`);
                }
              });
            }, 1000);
          });
      
          // Listen for 'o' from the device
          port.on('data', (data) => {
            const dataStr = data.toString();
            if (dataStr.includes('o')) {
              event.sender.send('log-message', `Successfully connected to device: ${device}`);
              isConnected = true;
              port.removeAllListeners('data'); // Remove the data listener after successful connection
            } else {
              event.sender.send('log-message', `Data received from device: ${device} - ${dataStr}`);
              port.close(); // Close the port if the received data is not the expected response
              setTimeout(tryConnect, 3000);
            }
          });
      
          port.on('error', (err) => {
            event.sender.send('log-message', `Error on device ${device}: "${err.message}"`);
            isConnected = false;
            setTimeout(tryConnect, 3000);
        });

    port.on('close', () => {
      event.sender.send('log-message', `Timing device disconnected with message: "Failed to receive initial connection message"`);
      isConnected = false;
      setTimeout(tryConnect, 3000); // Retry the connection after a 10-second delay
    });
  };

  tryConnect();
};

        
  


ipcMain.on('connect-to-device', (event, device) => {
  connectWithRetry(event, device, 5); // Attempt to connect to the device with a maximum of 5 retries
});
  