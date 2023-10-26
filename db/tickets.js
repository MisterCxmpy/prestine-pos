const sqlite = require("sqlite3").verbose();
const path = require("path")

const dbPath = path.resolve(__dirname, "./tickets.db");
const db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});

const tickets =
  "CREATE TABLE tickets (ticketNo VARCHAR(255), date DATE, day VARCHAR(20), items JSONB[], totalPieces INTEGER, ownerName VARCHAR(255), ownerMob VARCHAR(20), hasPaid BOOLEAN, totalPrice FLOAT)";

db.run(tickets, [], (err) => {
  if (err) console.error("Error creating Tickets: ", err);
  else console.log("Tickets created successfully.");
});

db.close((err) => {
  if (err) console.error("Error closing the database: ", err);
  else console.log("Database connection closed.");
});