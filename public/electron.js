const { app, BrowserWindow, ipcMain } = require('electron');
const sqlite3 = require("sqlite3").verbose();
const isDev = require('electron-is-dev'); 
const path = require('path');

const usersDbPath = isDev ? path.join(__dirname, "../db/users.db") : path.join(process.resourcesPath, "/db/users.db");
const usersDb = new sqlite3.Database(usersDbPath, sqlite3.OPEN_READWRITE);

const ticketsDbPath = isDev ? path.join(__dirname, "../db/tickets.db") : path.join(process.resourcesPath, "/db/tickets.db");
const ticketsDb = new sqlite3.Database(ticketsDbPath, sqlite3.OPEN_READWRITE);

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'favicon.ico'),
    webPreferences: {
      preload: isDev 
        ? path.join(app.getAppPath(), './public/preload.js') 
        : path.join(app.getAppPath(), './dist/preload.js'),
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
    },
  });

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

app.whenReady().then(async () => {
  await createWindow();
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

process.on('uncaughtException', (error) => {
  console.log(`Exception: ${error}`);
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Tickets

ipcMain.handle("insert-ticket", (event, args) => {
  const sql = "INSERT INTO tickets (ticketNo, date, day, items, totalPieces, ownerName, ownerMob, hasPaid, totalPrice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    ticketsDb.run(sql, [args.ticketNo, args.date, args.day, JSON.stringify(args.items), args.totalPieces, args.ownerName, args.ownerMob, args.hasPaid, args.totalPrice], function(err) {
      if (err) {
        reject(err.message);
      } else {
        resolve(`Ticket with ID ${this.lastID} inserted successfully.`);
      }
    });
  });
});

ipcMain.handle("get-all-tickets", (event) => {
  const sql = "SELECT * FROM tickets";
  return new Promise((resolve, reject) => {
    ticketsDb.all(sql, [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        const tickets = rows.map(row => ({
          ticketNo: row.ticketNo,
          date: row.date,
          day: row.day,
          items: JSON.parse(row.items),
          totalPieces: row.totalPieces,
          ownerName: row.ownerName,
          ownerMob: row.ownerMob,
          hasPaid: row.hasPaid,
          totalPrice: row.totalPrice
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
  console.log(args)
  const query = 'SELECT * FROM tickets WHERE ownerMob = ?';
  return new Promise((resolve, reject) => {
    ticketsDb.all(query, [args], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        const tickets = rows.map(row => ({
          ticketNo: row.ticketNo,
          date: row.date,
          day: row.day,
          items: JSON.parse(row.items),
          totalPieces: row.totalPieces,
          ownerName: row.ownerName,
          ownerMob: row.ownerMob,
          hasPaid: row.hasPaid,
          totalPrice: row.totalPrice
        }));
        resolve(tickets);
      }
    });
  });
});

// Users

// ipcMain.handle("insert-user", (event, args) => {

//   window.api.getUserByPhone(args.ownerMob, (err, existingUser) => {
//     if (err) {
//       return err
//     }

//     if (existingUser) {
//       const updatedTickets = JSON.parse(existingUser.tickets || '[]').concat(args.tickets);
//       window.api.updateUserTickets(args.ownerMob, updatedTickets), (updateErr) => {
//         if (updateErr) {
//           return updateErr
//         }
//         return "Successfully updated user tickets"
//       }
//     } else {
//       if (!args.ownerName || !ownerMob) {

//         const sql = "INSERT INTO users (ownerName, ownerMob, tickets) VALUES (?, ?, ?)";
//         return new Promise((resolve, reject) => {
//           usersDb.run(sql, [args.ownerName, args.ownerMob, JSON.stringify(args.tickets)], function(err) {
//             if (err) {
//               reject(err.message);
//             } else {
//               resolve(`User with ID ${this.lastID} inserted successfully.`);
//             }
//           });
//         });
//       }
//     }
//   })

// });


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
      console.log("Existing")
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