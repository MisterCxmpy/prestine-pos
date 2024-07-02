const { ipcMain } = require("electron");
const sqlite3 = require("sqlite3").verbose();
const isDev = require("electron-is-dev");
const path = require("path");

const ticketsDbPath = isDev
  ? path.join(__dirname, "../db/tickets.db")
  : path.join(prestineFolderPath, "/db/tickets.db");
const ticketsDb = new sqlite3.Database(ticketsDbPath, sqlite3.OPEN_READWRITE);

ipcMain.handle("insert-ticket", (event, args) => {
  const sql =
    "INSERT INTO tickets (ticketNo, date, dateOnly, day, items, totalPieces, ownerName, ownerMob, hasPaid, totalPrice, complete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  return new Promise((resolve, reject) => {
    ticketsDb.run(
      sql,
      [
        args.ticketNo,
        args.date,
        args.dateOnly,
        args.day,
        JSON.stringify(args.items),
        args.totalPieces,
        args.ownerName,
        args.ownerMob,
        args.hasPaid,
        args.totalPrice,
        args.complete,
      ],
      function (err) {
        if (err) {
          reject(err.message);
        } else {
          resolve(`Ticket with ID ${this.lastID} inserted successfully.`);
        }
      }
    );
  });
});

ipcMain.handle("get-all-tickets", (event) => {
  const sql = "SELECT * FROM tickets ORDER BY ticketNo";
  return new Promise((resolve, reject) => {
    ticketsDb.all(sql, [], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        const tickets = rows.map((row) => ({
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
          complete: row.complete,
        }));
        resolve(tickets);
      }
    });
  });
});

ipcMain.handle("check-ticket-number-exists", (event, args) => {
  const query = "SELECT * FROM tickets WHERE ticketNo = ?";
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
  const query = "SELECT * FROM tickets WHERE ownerMob = ?";
  return new Promise((resolve, reject) => {
    ticketsDb.all(query, [args], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        const tickets = rows.map((row) => ({
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
          complete: row.complete,
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
        const tickets = rows.map((row) => ({
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
          complete: row.complete,
        }));
        resolve(tickets);
      }
    });
  });
});

ipcMain.handle("set-ticket-to-complete", (event, args) => {
  const sql = "UPDATE tickets SET complete = ?, hasPaid = ? WHERE id = ?";

  return new Promise((resolve, reject) => {
    ticketsDb.run(sql, [true, true, args], function (err) {
      if (err) {
        reject(err.message);
      } else {
        resolve(`Ticket with ID ${args} marked as complete.`);
      }
    });
  });
});

ipcMain.handle("get-todays-data", (event, args) => {
  const today = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");

  const getDataSql = "SELECT * FROM tickets WHERE dateOnly = ?";
  const getTotalPriceSql =
    "SELECT totalPrice FROM tickets WHERE dateOnly = ? AND complete = ?";

  return new Promise((resolve, reject) => {
    ticketsDb.all(getDataSql, [today], (err, rows) => {
      if (err) {
        reject(err.message);
      } else {
        ticketsDb.all(getTotalPriceSql, [today, true], (err, priceRows) => {
          if (err) {
            reject(err.message);
          } else {
            const totalPrices = priceRows.reduce(
              (sum, row) => sum + row.totalPrice,
              0
            );
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

module.exports = ticketsDb;
