# Miboso Backend

This is the backend server for the Miboso project. It's built with Node.js, Express, SQLite, and Redis.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Redis](https://redis.io/) (Running on `localhost:6379`)

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Redis**
   Make sure your Redis server is running:
   ```bash
   redis-server
   ```

3. **Initialize Database**
   ```bash
   npm run db:init
   ```

4. **Run the Server (Development)**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:4000`.

## Viewing Database Data

Since the project uses **SQLite**, you can view the data directly from your terminal using the SQLite CLI:

1. **Open the database**:
   ```bash
   sqlite3 database.sqlite
   ```

2. **Run queries**:
   ```sql
   -- View all reservations with user details
   SELECT u.email, u.first_name, r.reservation_day, r.reservation_time 
   FROM reservations r 
   JOIN users u ON r.user_id = u.id;

   -- View all users
   SELECT * FROM users;
   ```

3. **Exit**:
   Type `.exit` to return to your terminal.

## Features

- **Double-booking Prevention**: Uses Redis for distributed locking to handle concurrent reservation attempts safely.

## Scripts

- `npm start` - Starts the server normally (`node server.js`).
- `npm run dev` - Starts the server with live reloading via `nodemon`.
- `npm run db:init` - Initializes the SQLite database.
