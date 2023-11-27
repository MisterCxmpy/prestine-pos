const sqlite = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "./performance.db");
const db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});

const performance =
  "CREATE TABLE performance (ID INTEGER UNIQUE PRIMARY KEY, date DATE, takenIn INTEGER, earnings FLOAT)";

db.run(performance, [], (err) => {
  if (err) console.error("Error creating Performance table: ", err);
  else console.log("Performance table created successfully.");
});

db.close((err) => {
  if (err) console.error("Error closing the database: ", err);
  else console.log("Database connection closed.");
});
