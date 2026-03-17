const db = require('../infrastructure/persistence/db');

class ReservationRepository {
  async findAll() {
    const query = `
      SELECT 
        u.email, 
        u.first_name as firstName, 
        u.last_name as lastName,
        r.reservation_day as day,
        r.reservation_month as month,
        r.reservation_year as year,
        r.reservation_time as time,
        r.created_at as timestamp
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `;
    
    try {
      const { rows } = await db.query(query);
      return rows.map(row => ({
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        date: {
          day: row.day,
          month: row.month,
          year: row.year
        },
        time: row.time,
        timestamp: row.timestamp
      }));
    } catch (error) {
      console.error('[Repository] Error in findAll:', error);
      throw error;
    }
  }

  async save(reservation) {
    try {
      // 1. Get or create user
      let userQuery = 'SELECT id FROM users WHERE email = ?';
      let { rows: userRows } = await db.query(userQuery, [reservation.email]);
      
      let userId;
      if (userRows.length > 0) {
        userId = userRows[0].id;
      } else {
        const insertUserQuery = 'INSERT INTO users (email, first_name, last_name) VALUES (?, ?, ?)';
        const result = await db.query(insertUserQuery, [reservation.email, reservation.firstName, reservation.lastName]);
        userId = result.lastID;
      }

      // 2. Save reservation linked to user
      const query = `
        INSERT INTO reservations (
          user_id,
          reservation_day, reservation_month, reservation_year, 
          reservation_time
        )
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const values = [
        userId,
        reservation.date.day,
        reservation.date.month,
        reservation.date.year,
        reservation.time
      ];

      await db.query(query, values);
      return reservation;
    } catch (error) {
      console.error('[Repository] Error in save:', error);
      throw error;
    }
  }

  async findBySlot(day, month, year, time) {
    const query = `
      SELECT id FROM reservations 
      WHERE reservation_day = ? 
      AND reservation_month = ? 
      AND reservation_year = ? 
      AND reservation_time = ?
    `;
    const { rows } = await db.query(query, [day, month, year, time]);
    return rows.length > 0;
  }
}

module.exports = new ReservationRepository();
