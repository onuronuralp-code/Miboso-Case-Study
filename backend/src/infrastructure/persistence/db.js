const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[Database] Could not connect to SQLite', err);
  } else {
    console.log('[Database] Connected to SQLite');
  }
});

module.exports = {
  query: (text, params = []) => {
    return new Promise((resolve, reject) => {
      // Convert PostgreSQL-style $1, $2 to SQLite-style ?
      let sqliteQuery = text;
      params.forEach((_, i) => {
        sqliteQuery = sqliteQuery.replace(`$${i + 1}`, '?');
      });

      if (text.trim().toUpperCase().startsWith('SELECT')) {
        db.all(sqliteQuery, params, (err, rows) => {
          if (err) {
            console.error('[Database] SELECT Error:', err.message, '\nQuery:', sqliteQuery);
            reject(err);
          } else resolve({ rows });
        });
      } else if (text.trim().toUpperCase().startsWith('INSERT')) {
        db.run(sqliteQuery, params, function(err) {
          if (err) {
            console.error('[Database] INSERT Error:', err.message, '\nQuery:', sqliteQuery);
            reject(err);
          } else resolve({ 
            rows: [ { id: this.lastID } ], 
            lastID: this.lastID, 
            changes: this.changes 
          });
        });
      } else {
        db.run(sqliteQuery, params, function(err) {
          if (err) {
            console.error('[Database] Execution Error:', err.message, '\nQuery:', sqliteQuery);
            reject(err);
          } else resolve({ lastID: this.lastID, changes: this.changes });
        });
      }
    });
  },
  db
};
