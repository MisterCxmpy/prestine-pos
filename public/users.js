const { ipcMain } = require("electron");
const sqlite3 = require("sqlite3").verbose();
const isDev = require("electron-is-dev");
const path = require("path");

const usersDbPath = isDev
  ? path.join(__dirname, "../db/users.db")
  : path.join(prestineFolderPath, "/db/users.db");
const usersDb = new sqlite3.Database(usersDbPath, sqlite3.OPEN_READWRITE);

ipcMain.handle("insert-user", async (event, args) => {
  const checkUserSQL = "SELECT * FROM users WHERE ownerMob = ?";
  const updateUserTicketsSQL = `UPDATE users SET tickets = ? WHERE ownerMob = ?`;
  const insertUserSQL =
    "INSERT INTO users (ownerName, ownerMob, tickets) VALUES (?, ?, ?)";

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
      const updatedTickets = JSON.parse(existingUser.tickets || "[]").concat(
        args.tickets
      );
      return new Promise((resolve, reject) => {
        usersDb.run(
          updateUserTicketsSQL,
          [JSON.stringify(updatedTickets), args.ownerMob],
          function (err) {
            if (err) {
              reject(err.message);
            } else {
              resolve(
                `User with ownerMob ${args.ownerMob} tickets updated successfully.`
              );
            }
          }
        );
      });
    } else {
      if (!args.ownerMob) {
        return "Missing credientials";
      } else {
        return new Promise((resolve, reject) => {
          usersDb.run(
            insertUserSQL,
            [args.ownerName, args.ownerMob, JSON.stringify(args.tickets)],
            function (err) {
              if (err) {
                reject(err.message);
              } else {
                resolve(`User with ID ${this.lastID} inserted successfully.`);
              }
            }
          );
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
    usersDb.run(
      updateQuery,
      [JSON.stringify(args.updatedTickets), args.ownerMob],
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve(
            `User with ownerMob ${args.ownerMob} tickets updated successfully.`
          );
        }
      }
    );
  });
});

ipcMain.handle("get-all-users", (event) => {
  const sql = "SELECT * FROM users";
  return new Promise((resolve, reject) => {
    usersDb.all(sql, [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        const users = rows.map((row) => ({
          userID: row.ID,
          ownerName: row.ownerName,
          ownerMob: row.ownerMob,
          tickets: JSON.parse(row.tickets),
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
      usersDb.run(
        updateUserSQL,
        [args.ownerName, args.newOwnerMob, args.ownerMob],
        function (err) {
          if (err) {
            reject(err.message);
          } else {
            ticketsDb.run(
              updateTicketsOwnerSQL,
              [args.ownerName, args.newOwnerMob, args.ownerMob],
              function (err) {
                if (err) {
                  reject(err.message);
                } else {
                  resolve(
                    `User with ownerMob ${args.ownerMob} and associated tickets updated successfully.`
                  );
                }
              }
            );
          }
        }
      );
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

module.exports = usersDb;
