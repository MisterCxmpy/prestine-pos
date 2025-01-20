const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const sqlite3 = require("sqlite3").verbose();
const isDev = require('electron-is-dev'); 
const path = require('path');
const fs = require('fs');
const { autoUpdater, AppUpdater } = require("electron-updater")

const userDocumentsPath = app.getPath('documents');
const prestineFolderPath = path.join(userDocumentsPath, 'Prestine');

if (!isDev && !fs.existsSync(prestineFolderPath)) {
  fs.mkdirSync(prestineFolderPath);
}

const usersDbPath = isDev ? path.join(__dirname, "../db/users.db") : path.join(prestineFolderPath, "/db/users.db");
const usersDb = new sqlite3.Database(usersDbPath, sqlite3.OPEN_READWRITE);

const ticketsDbPath = isDev ? path.join(__dirname, "../db/tickets.db") : path.join(prestineFolderPath, "/db/tickets.db");
const ticketsDb = new sqlite3.Database(ticketsDbPath, sqlite3.OPEN_READWRITE);

const performanceDbPath = isDev ? path.join(__dirname, "../db/performance.db") : path.join(prestineFolderPath, "/db/performance.db");
const performanceDb = new sqlite3.Database(performanceDbPath, sqlite3.OPEN_READWRITE);

const weeklyEarningsDbPath = isDev ? path.join(__dirname, "../db/weeklyEarnings.db") : path.join(prestineFolderPath, "/db/weeklyEarnings.db");
const weeklyEarningsDb = new sqlite3.Database(weeklyEarningsDbPath, sqlite3.OPEN_READWRITE);

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
    mainWindow.webContents.openDevTools({ mode: 'detach' });
    mainWindow.webContents.on('did-frame-finish-load', () => {
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
  }
  dialog.showMessageBox(dialogOpts, (response) => {
  });
})

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  autoUpdater.quitAndInstall();
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
  const sql = "SELECT * FROM tickets ORDER BY id";
  return new Promise((resolve, reject) => {
    ticketsDb.all("PRAGMA query_only = false;", [], (err) => {
      if (err) {
        reject(err.message);
        return;
      }

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

ipcMain.handle("update-user", async (event, args) => {
  const updateUserSQL = `UPDATE users SET ownerName = ?, ownerMob = ? WHERE ownerMob = ?`;
  const updateTicketsOwnerSQL = `UPDATE tickets SET ownerName = ?, ownerMob = ? WHERE ownerMob = ?`;

  try {
    if (!args.ownerMob || !args.ownerName || !args.newOwnerMob) {
      return "Missing credentials";
    }

    return new Promise((resolve, reject) => {
      // Update ownerName and ownerMob in the users table
      usersDb.run(updateUserSQL, [args.ownerName, args.newOwnerMob, args.ownerMob], function (err) {
        if (err) {
          reject(err.message);
        } else {
          // Update ownerName and ownerMob in the tickets table
          ticketsDb.run(updateTicketsOwnerSQL, [args.ownerName, args.newOwnerMob, args.ownerMob], function (err) {
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


ipcMain.handle("delete-user-by-id", (event, args) => {
  const sql = "DELETE FROM users WHERE id = ?";
  return new Promise((resolve, reject) => {
    usersDb.run(sql, [args], function (err) {
      if (err) {
        reject(err.message);
      } else {
        if (this.changes > 0) {
          resolve({ success: true, message: "User deleted successfully" });
        } else {
          resolve({ success: false, message: "User not found" });
        }
      }
    });
  });
});

// Performance

const currentYear = new Date().getFullYear();

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

ipcMain.handle("get-all-week-performance", (event, args) => {
  const selectQuery = `SELECT * FROM weekly_earnings`;

  return new Promise((resolve, reject) => {
    weeklyEarningsDb.all(selectQuery, [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.handle("update-performance", (event, args) => {
  const currentDate = new Date();
  const currentDateString = currentDate.toLocaleDateString('en-GB');
  const currentWeek = getWeekNumber(currentDate);

  const selectQuery = `SELECT * FROM performance WHERE date = ?`;
  const updateQuery = `UPDATE performance SET takenIn = ?, earnings = ? WHERE date = ?`;

  return new Promise((resolve, reject) => {
    performanceDb.get(selectQuery, [currentDateString], (selectErr, row) => {
      if (selectErr) {
        reject(selectErr.message);
        return;
      }

      const updatedTakenIn = row ? row.takenIn + args.takenIn : args.takenIn;
      const updatedEarnings = row ? row.earnings + args.earnings : args.earnings;

      performanceDb.run(updateQuery, [updatedTakenIn, updatedEarnings, currentDateString], async (updateErr) => {
        if (updateErr) {
          reject(updateErr.message);
        } else {
          updateWeeklyEarnings(currentWeek, args.earnings);          
          resolve(`Performance for date ${currentDateString} updated successfully.`);
        }
      });
    });
  });
});


function getWeekNumber(date) {
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const differenceInTime = date - oneJan;
  const weekNumber = Math.ceil((differenceInTime / (7 * 24 * 60 * 60 * 1000)) + oneJan.getDay() / 7);
  return weekNumber;
}

function updateWeeklyEarnings(week, earnings) {
  const selectWeeklyQuery = `SELECT * FROM weekly_earnings WHERE week = ?`;
  const updateWeeklyQuery = `UPDATE weekly_earnings SET earnings = ? WHERE week = ?`;
  const insertWeeklyQuery = `INSERT INTO weekly_earnings (week, earnings) VALUES (?, ?)`;

  weeklyEarningsDb.get(selectWeeklyQuery, [week], (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    if (row) {
      weeklyEarningsDb.run(updateWeeklyQuery, [row.earnings + earnings, week], (updateErr) => {
        if (updateErr) {
          console.error(updateErr.message);
        }
      });
    } else {
      weeklyEarningsDb.run(insertWeeklyQuery, [week, earnings], (insertErr) => {
        if (insertErr) {
          console.error(insertErr.message);
        }
      });
    }
  });
}

ipcMain.handle("get-monthly-earnings", async (event, args) => {
  try {
    const monthlyEarnings = await calculateMonthlyEarnings();
    return monthlyEarnings;
  } catch (error) {
    console.error("Error calculating monthly earnings:", error.message);
    return { error: "Error calculating monthly earnings" };
  }
});

async function calculateMonthlyEarnings() {
  return new Promise((resolve, reject) => {
    const weekToMonth = [
      [1, 4], [5, 8], [9, 13], [14, 17], [18, 21],
      [22, 26], [27, 30], [31, 35], [36, 39], [40, 43], [44, 48], [49, 52]
    ];

    const query = `SELECT week, earnings FROM weekly_earnings`;

    weeklyEarningsDb.all(query, [], (err, rows) => {
      if (err) {
        return reject(err);
      }

      const monthlyEarnings = Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        totalEarnings: 0,
      }));

      rows.forEach(row => {
        weekToMonth.forEach(([start, end], monthIndex) => {
          if (row.week >= start && row.week <= end) {
            monthlyEarnings[monthIndex].totalEarnings += row.earnings || 0;
          }
        });
      });

      resolve(monthlyEarnings);
    });
  });
}




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
  const servicesPath = isDev ? path.join(__dirname, '../src/data', 'services.json') : path.join(prestineFolderPath, "services.json");
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

  return services.services;
});

ipcMain.handle('add-item', (event, args) => {
  const servicesPath = isDev ? path.join(__dirname, '../src/data', 'services.json') : path.join(prestineFolderPath, "services.json");
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf-8'));

  services.services[args.category] = [...services.services[args.category], args.item];

  fs.writeFileSync(servicesPath, JSON.stringify(services, null, 2));

  return { success: true };
});

ipcMain.handle('delete-item', (event, args) => {
  const servicesPath = isDev ? path.join(__dirname, '../src/data', 'services.json') : path.join(prestineFolderPath, "services.json");
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


