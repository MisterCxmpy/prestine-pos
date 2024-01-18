const sqlite = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "./weeklyEarnings.db");
const db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});

const weeklyEarnings = `
  CREATE TABLE IF NOT EXISTS weekly_earnings (
    ID INTEGER UNIQUE PRIMARY KEY,
    week INTEGER,
    earnings FLOAT
  )`;

db.run(weeklyEarnings, [], (err) => {
  if (err) console.error("Error creating WeeklyEarnings table: ", err);
  else {
    console.log("WeeklyEarnings table created successfully.");
    populateWeeklyEarningsTable(db);
  }
});

function populateWeeklyEarningsTable(database) {
  const insertWeeklyQuery = `INSERT INTO weekly_earnings (ID, week, earnings) VALUES (?, ?, ?)`;
  const numberOfWeeksInYear = 52;

  for (let week = 1; week <= numberOfWeeksInYear; week++) {
    database.run(insertWeeklyQuery, [week, week, 0], (insertErr) => {
      if (insertErr) {
        console.error("Error inserting data into WeeklyEarnings table: ", insertErr);
      }
    });
  }
}

setTimeout(() => {
  db.close((err) => {
    if (err) console.error("Error closing the database: ", err);
    else console.log("Database connection closed.");
  });
}, 1000);
