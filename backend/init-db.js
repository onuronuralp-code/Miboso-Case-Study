const db = require('./src/infrastructure/persistence/db');
const fs = require('fs');
const path = require('path');

async function initDb() {
  const schemaPath = path.join(__dirname, 'src/infrastructure/persistence/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  // To transition to the new relational schema, we'll recreate the tables
  // SQLite doesn't support DROP TABLE IF EXISTS ... CASCADE easily, 
  // so we'll just drop them individually
  try {
    console.log('[Init] Dropping old tables to upgrade to relational schema...');
    // Disable foreign keys for dropping
    await db.query('PRAGMA foreign_keys = OFF');
    await db.query('DROP TABLE IF EXISTS reservations');
    await db.query('DROP TABLE IF EXISTS users');
    await db.query('PRAGMA foreign_keys = ON');
    
    // Split schema into individual commands
    const commands = schema.split(';').filter(cmd => cmd.trim());

    console.log('[Init] Building new relational structure...');
    for (const cmd of commands) {
      await db.query(cmd);
    }
    console.log('[Init] Database schema updated successfully.');
    
    // Migrate data from JSON if it exists
    const jsonPath = path.join(__dirname, 'reservations.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (data.length > 0) {
        console.log(`[Init] Found ${data.length} reservations for migration...`);
        
        for (const res of data) {
          try {
            // 1. Get or create user
            let userId;
            const userCheck = await db.query('SELECT id FROM users WHERE email = ?', [res.email]);
            
            if (userCheck.rows.length > 0) {
              userId = userCheck.rows[0].id;
            } else {
              const userInsert = await db.query(
                'INSERT INTO users (email, first_name, last_name) VALUES (?, ?, ?)',
                [res.email, res.firstName, res.lastName]
              );
              userId = userInsert.lastID;
            }

            // 2. Insert reservation
            await db.query(`
              INSERT OR IGNORE INTO reservations (
                user_id,
                reservation_day, reservation_month, reservation_year, 
                reservation_time, created_at
              )
              VALUES (?, ?, ?, ?, ?, ?)
            `, [
              userId,
              res.date.day, 
              res.date.month, 
              res.date.year, 
              res.time,
              res.timestamp || new Date().toISOString()
            ]);
          } catch (e) {
            console.error(`[Init] Migration error for ${res.email}:`, e.message);
          }
        }
        console.log('[Init] Migration successful. User and Reservations are now separated.');
      }
    }
  } catch (error) {
    console.error('[Init] Error during database initialization:', error);
  } finally {
    process.exit();
  }
}

initDb();
