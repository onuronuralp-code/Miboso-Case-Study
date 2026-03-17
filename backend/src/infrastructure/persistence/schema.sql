-- SQLite Schema with Relations
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    reservation_day INTEGER NOT NULL,
    reservation_month INTEGER NOT NULL,
    reservation_year INTEGER NOT NULL,
    reservation_time TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Unique index to prevent double booking on the same slot
CREATE UNIQUE INDEX IF NOT EXISTS idx_no_double_booking 
ON reservations (reservation_day, reservation_month, reservation_year, reservation_time);
