const sqlite = require("sqlite3").verbose();
const path = require("path")

const dbPath = path.resolve(__dirname, "./users.db");
const db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});

const users =
  "CREATE TABLE users (ID INTEGER UNIQUE PRIMARY KEY, ownerName VARCHAR(255), ownerMob VARCHAR(20), tickets JSONB[])";

db.run(users, [], (err) => {
  if (err) console.error("Error creating Users: ", err);
  else console.log("Users created successfully.");
});

db.close((err) => {
  if (err) console.error("Error closing the database: ", err);
  else console.log("Database connection closed.");
});