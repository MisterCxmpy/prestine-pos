const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const sqlite3 = require("sqlite3").verbose();
const isDev = require('electron-is-dev'); 
const path = require('path');
const fs = require('fs');
const { autoUpdater, AppUpdater } = require("electron-updater")

function getUserDataPath() {
  return isDev
    ? path.join(app.getAppPath(), 'userdata/')
    : path.join(process.resourcesPath, 'userdata/');
}

function backupUserData() {
  const userDataPath = getUserDataPath();
  const backupPath = path.join(userDataPath, 'backup');

  fs.mkdirSync(backupPath, { recursive: true });

  const filesToBackup = ['persistentFile'];

  filesToBackup.forEach((file) => {
    fs.copyFileSync(path.join(userDataPath, file), path.join(backupPath, `${file}_backup`));
  });
}

// Function to restore user data after update
function restoreUserData() {
  const userDataPath = getUserDataPath();
  const backupPath = path.join(userDataPath, 'backup');

  const filesToRestore = ['persistentFile']; // Add more files if needed

  filesToRestore.forEach((file) => {
    const backupFilePath = path.join(backupPath, `${file}_backup`);
    const targetFilePath = path.join(userDataPath, file);

    // Check if the backup file exists before attempting to restore
    if (fs.existsSync(backupFilePath)) {
      fs.copyFileSync(backupFilePath, targetFilePath);
    } else {
      console.error(`Backup file ${backupFilePath} not found. Skipping restore.`);
    }
  });

  // Optionally, remove the backup directory after restoring data
  if (fs.existsSync(backupPath)) {
    fs.rmSync(backupPath, { recursive: true });
  }
}



const usersDbPath = isDev ? path.join(__dirname, "../db/users.db") : path.join(process.resourcesPath, "/db/users.db");
const usersDb = new sqlite3.Database(usersDbPath, sqlite3.OPEN_READWRITE);

const ticketsDbPath = isDev ? path.join(__dirname, "../db/tickets.db") : path.join(process.resourcesPath, "/db/tickets.db");
const ticketsDb = new sqlite3.Database(ticketsDbPath, sqlite3.OPEN_READWRITE);

const performanceDbPath = isDev ? path.join(__dirname, "../db/performance.db") : path.join(process.resourcesPath, "/db/performance.db");
const performanceDb = new sqlite3.Database(performanceDbPath, sqlite3.OPEN_READWRITE);

let mainWindow;

autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

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
  restoreUserData()
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
  }
  dialog.showMessageBox(dialogOpts, (response) => {
  });
})

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      backupUserData();
      autoUpdater.quitAndInstall();
    }
  });
});

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info);
});

autoUpdater.on('update-not-available', () => {
  console.log('Update not available.');
});

autoUpdater.on('error', (err) => {
  console.error('Update error:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  console.log('Download progress:', progressObj);
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info);
});

process.on('uncaughtException', (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Tickets

ipcMain.handle("insert-ticket", (event, args) => {
  const sql = "INSERT INTO tickets (ticketNo, date, dateOnly, day, items, totalPieces, ownerName, ownerMob, hasPaid, totalPrice, complete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    ticketsDb.run(sql, [args.ticketNo, args.date, args.dateOnly, args.day, JSON.stringify(args.items), args.totalPieces, args.ownerName, args.ownerMob, args.hasPaid, args.totalPrice, args.complete], function(err) {
      if (err) {
        reject(err.message);
      } else {
        resolve(`Ticket with ID ${this.lastID} inserted successfully.`);
      }
    });
  });
});



ipcMain.handle("get-all-tickets", (event) => {
  const sql = "SELECT * FROM tickets ORDER BY ticketNo";
  return new Promise((resolve, reject) => {
    ticketsDb.all(sql, [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        const tickets = rows.map(row => ({
          id: row.ID,
          ticketNo: row.ticketNo,
          date: row.date,
          dateOnly: row.dateOnly,
          day: row.day,
          items: JSON.parse(row.items),
          totalPieces: row.totalPieces,
          ownerName: row.ownerName,
          ownerMob: row.ownerMob,
          hasPaid: row.hasPaid,
          totalPrice: row.totalPrice,
          complete: row.complete
        }));
        resolve(tickets);
      }
    });
  });
});

ipcMain.handle("check-ticket-number-exists", (event, args) => {
  const query = 'SELECT * FROM tickets WHERE ticketNo = ?';
  return new Promise((resolve, reject) => {
    ticketsDb.get(query, [args], (err, row) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(row);
      }
    });
  });
});

ipcMain.handle("get-ticket-by-phone", (event, args) => {
  const query = 'SELECT * FROM tickets WHERE ownerMob = ?';
  return new Promise((resolve, reject) => {
    ticketsDb.all(query, [args], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        const tickets = rows.map(row => ({
          id: row.ID,
          ticketNo: row.ticketNo,
          date: row.date,
          day: row.day,
          items: JSON.parse(row.items),
          totalPieces: row.totalPieces,
          ownerName: row.ownerName,
          ownerMob: row.ownerMob,
          hasPaid: row.hasPaid,
          totalPrice: row.totalPrice,
          complete: row.complete
        }));
        resolve(tickets);
      }
    });
  });
});

ipcMain.handle("get-recent-tickets", (event) => {
  const sql = "SELECT * FROM tickets ORDER BY id DESC LIMIT 15";
  return new Promise((resolve, reject) => {
    ticketsDb.all(sql, [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        const tickets = rows.map(row => ({
          id: row.ID,
          ticketNo: row.ticketNo,
          date: row.date,
          day: row.day,
          items: JSON.parse(row.items),
          totalPieces: row.totalPieces,
          ownerName: row.ownerName,
          ownerMob: row.ownerMob,
          hasPaid: row.hasPaid,
          totalPrice: row.totalPrice,
          complete: row.complete
        }));
        resolve(tickets);
      }
    });
  });
});

ipcMain.handle("set-ticket-to-complete", (event, args) => {
  const sql = "UPDATE tickets SET complete = ?, hasPaid = ? WHERE id = ?";

  return new Promise((resolve, reject) => {
    ticketsDb.run(sql, [true, true, args], function(err) {
      if (err) {
        reject(err.message);
      } else {
        resolve(`Ticket with ID ${args} marked as complete.`);
      }
    });
  });
});

ipcMain.handle("get-todays-data", (event, args) => {
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '-');

  const getDataSql = "SELECT * FROM tickets WHERE dateOnly = ?";
  const getTotalPriceSql = "SELECT totalPrice FROM tickets WHERE dateOnly = ? AND complete = ?";
  
  return new Promise((resolve, reject) => {
    ticketsDb.all(getDataSql, [today], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        ticketsDb.all(getTotalPriceSql, [today, true], (err, priceRows) => {
          if (err) {
            reject(err.message);
          } else {
            const totalPrices = priceRows.reduce((sum, row) => sum + row.totalPrice, 0);
            resolve({ tickets: rows.length, totalPrices: totalPrices });
          }
        });
      }
    });
  });
});

ipcMain.handle("delete-ticket-by-id", (event, args) => {
  const sql = "DELETE FROM tickets WHERE id = ?";
  return new Promise((resolve, reject) => {
    ticketsDb.run(sql, [args], function (err) {
      if (err) {
        reject(err.message);
      } else {
        if (this.changes > 0) {
          resolve({ success: true, message: "Ticket deleted successfully" });
        } else {
          resolve({ success: false, message: "Ticket not found" });
        }
      }
    });
  });
});


// Users

ipcMain.handle("insert-user", async (event, args) => {
  const checkUserSQL = "SELECT * FROM users WHERE ownerMob = ?";
  const updateUserTicketsSQL = `UPDATE users SET tickets = ? WHERE ownerMob = ?`;
  const insertUserSQL = "INSERT INTO users (ownerName, ownerMob, tickets) VALUES (?, ?, ?)";

  try {
    const existingUser = await new Promise((resolve, reject) => {
      usersDb.get(checkUserSQL, [args.ownerMob], (err, row) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(row);
        }
      });
    });

    if (existingUser) {
      const updatedTickets = JSON.parse(existingUser.tickets || '[]').concat(args.tickets);
      return new Promise((resolve, reject) => {
        usersDb.run(updateUserTicketsSQL, [JSON.stringify(updatedTickets), args.ownerMob], function (err) {
          if (err) {
            reject(err.message);
          } else {
            resolve(`User with ownerMob ${args.ownerMob} tickets updated successfully.`);
          }
        });
      });
    } else {
      if (!args.ownerMob) {
        return "Missing credientials"
      } else {
        return new Promise((resolve, reject) => {
          usersDb.run(insertUserSQL, [args.ownerName, args.ownerMob, JSON.stringify(args.tickets)], function(err) {
            if (err) {
              reject(err.message);
            } else {
              resolve(`User with ID ${this.lastID} inserted successfully.`);
            }
          });
        });
      }
    }
  } catch (error) {
    return error.message;
  }
});

ipcMain.handle("get-user-by-phone", (event, args) => {
  const sql = "SELECT * FROM users WHERE ownerMob = ?";
  return new Promise((resolve, reject) => {
    usersDb.get(sql, [args], (err, row) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(row);
      }
    });
  });
});

ipcMain.handle("update-user-tickets", (event, args) => {
  const updateQuery = `UPDATE users SET tickets = ? WHERE ownerMob = ?`;
  return new Promise((resolve, reject) => {
    usersDb.run(updateQuery, [JSON.stringify(args.updatedTickets), args.ownerMob], function (err) {
      if (err) {
        reject(err.message);
      } else {
        resolve(`User with ownerMob ${args.ownerMob} tickets updated successfully.`);
      }
    });
  });
});

ipcMain.handle("get-all-users", (event) => {
  const sql = "SELECT * FROM users";
  return new Promise((resolve, reject) => {
    usersDb.all(sql, [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        const users = rows.map(row => ({
          userID: row.ID,
          ownerName: row.ownerName,
          ownerMob: row.ownerMob,
          tickets: JSON.parse(row.tickets)
        }));
        resolve(users);
      }
    });
  });
});

ipcMain.handle("update-user-name", async (event, args) => {
  const updateUserSQL = `UPDATE users SET ownerName = ? WHERE ownerMob = ?`;
  const updateTicketsOwnerNameSQL = `UPDATE tickets SET ownerName = ? WHERE ownerMob = ?`;

  try {
    if (!args.ownerMob || !args.ownerName) {
      return "Missing credentials";
    }

    return new Promise((resolve, reject) => {
      // Update ownerName in the users table
      usersDb.run(updateUserSQL, [args.ownerName, args.ownerMob], function (err) {
        if (err) {
          reject(err.message);
        } else {
          // Update ownerName in the tickets table
          ticketsDb.run(updateTicketsOwnerNameSQL, [args.ownerName, args.ownerMob], function (err) {
            if (err) {
              reject(err.message);
            } else {
              resolve(`User with ownerMob ${args.ownerMob} and associated tickets updated successfully.`);
            }
          });
        }
      });
    });
  } catch (error) {
    return error.message;
  }
});



// Performance

ipcMain.handle("get-performance-today", (event, args) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const selectQuery = `SELECT * FROM performance WHERE date = ?`;

  return new Promise((resolve, reject) => {
    performanceDb.all(selectQuery, [currentDate], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("get-all-performance", (event, args) => {
  const selectQuery = `SELECT * FROM performance`;

  return new Promise((resolve, reject) => {
    performanceDb.all(selectQuery, [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("update-performance", (event, args) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const selectQuery = `SELECT * FROM performance WHERE date = ?`;
  const updateQuery = `UPDATE performance SET takenIn = ?, earnings = ? WHERE date = ?`;

  return new Promise((resolve, reject) => {
    performanceDb.get(selectQuery, [currentDate], (selectErr, row) => {
      if (selectErr) {
        reject(selectErr.message);
        return;
      }

      const updatedTakenIn = row ? row.takenIn + args.takenIn : args.takenIn;
      const updatedEarnings = row ? row.earnings + args.earnings : args.earnings;

      performanceDb.run(updateQuery, [updatedTakenIn, updatedEarnings, currentDate], (updateErr) => {
        if (updateErr) {
          reject(updateErr.message);
        } else {
          resolve(`Performance for date ${currentDate} updated successfully.`);
        }
      });
    });
  });
});

ipcMain.handle("create-new-day", async (event, args) => {
  const currentDate = new Date().toLocaleDateString('en-GB');
  const checkQuery = `SELECT * FROM performance WHERE date = ?`;
  const insertQuery = `INSERT INTO performance (date, takenIn, earnings) VALUES (?, 0, 0)`;

  try {
    const existingEntry = await new Promise((resolve, reject) => {
      performanceDb.get(checkQuery, [currentDate], (err, row) => {
        if (err) {
          reject(err.message);
        } else {
          resolve(row);
        }
      });
    });

    if (!existingEntry) {
      await new Promise((resolve, reject) => {
        performanceDb.run(insertQuery, [currentDate], function (err) {
          if (err) {
            reject(err.message);
          } else {
            resolve(`New day entry for date ${currentDate} created successfully.`);
          }
        });
      });

      return `New day entry for date ${currentDate} created successfully.`;
    } else {
      return `Entry for date ${currentDate} already exists.`;
    }
  } catch (error) {
    return `Error creating new day entry: ${error}`;
  }
});

// Services

ipcMain.handle('get-all-services', (event, args) => {
  const servicesPath = isDev ? path.join(__dirname, '../src/data', 'services.json') : path.join(process.resourcesPath, "services.json");
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

  return services.services;
});

ipcMain.handle('add-item', (event, args) => {
  const servicesPath = isDev ? path.join(__dirname, '../src/data', 'services.json') : path.join(process.resourcesPath, "services.json");
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

  services.services[args.category] = [...services.services[args.category], args.item];

  fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

  return { success: true };
});

ipcMain.handle('delete-item', (event, args) => {
  const servicesPath = isDev ? path.join(__dirname, '../src/data', 'services.json') : path.join(process.resourcesPath, "services.json");
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

  const itemId = args.itemId;

  for (const category in services.services) {
    const categoryItems = services.services[category];
    
    const itemIndex = categoryItems.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
      categoryItems.splice(itemIndex, 1);
      fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));
      return { success: true };
    }
  }

  return { success: false, error: 'Item not found' };
});


