const { ipcMain } = require('electron');
const sqlite3 = require('sqlite3').verbose();
const isDev = require('electron-is-dev');
const path = require('path');

const performanceDbPath = isDev ? path.join(__dirname, "../db/performance.db") : path.join(prestineFolderPath, "/db/performance.db");
const performanceDb = new sqlite3.Database(performanceDbPath, sqlite3.OPEN_READWRITE);

const weeklyEarningsDbPath = isDev ? path.join(__dirname, "../db/weeklyEarnings.db") : path.join(prestineFolderPath, "/db/weeklyEarnings.db");
const weeklyEarningsDb = new sqlite3.Database(weeklyEarningsDbPath, sqlite3.OPEN_READWRITE);

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

      performanceDb.run(updateQuery, [updatedTakenIn, updatedEarnings, currentDateString], (updateErr) => {
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
  return new Promise(async (resolve, reject) => {
    const monthlyEarnings = [];

    // Create an array to store all the promises
    const promises = [];

    // Iterate through each month
    for (let month = 1; month <= 12; month++) {
      // Calculate the start and end week for the current month
      const startOfWeek = Math.ceil((month - 1) * 4.333) + 1;
      const endOfWeek = Math.floor(month * 4.333);

      const query = `
        SELECT SUM(earnings) as totalEarnings
        FROM weekly_earnings
        WHERE week >= ? AND week <= ?;
      `;

      // Create a promise for each query and push it to the array
      const promise = new Promise((innerResolve, innerReject) => {
        weeklyEarningsDb.get(query, [startOfWeek, endOfWeek], (err, row) => {
          if (err) {
            innerReject(err);
          } else {
            monthlyEarnings.push({
              month,
              totalEarnings: row ? row.totalEarnings : 0,
            });
            innerResolve();
          }
        });
      });

      promises.push(promise);
    }

    // Wait for all promises to resolve before resolving the main promise
    try {
      await Promise.all(promises);
      resolve(monthlyEarnings);
    } catch (error) {
      reject(error);
    }
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

module.exports = performanceDb;