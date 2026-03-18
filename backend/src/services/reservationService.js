const reservationRepository = require('../repositories/reservationRepository');
const redisClient = require('../infrastructure/redis/redisClient');

class ReservationService {
  async getAllReservations() {
    return await reservationRepository.findAll();
  }

  async createReservation(reservationData) {
    const { email, firstName, lastName, date, time } = reservationData;
    
    // Validate inputs
    if (!email || !firstName || !lastName || !date || !time) {
      throw new Error('All fields are required');
    }

    const lockKey = `lock:reservation:${date.year}:${date.month}:${date.day}:${time}`;
    
    // Attempt to acquire a distributed lock using Redis (10 second TTL)
    const acquired = await redisClient.set(lockKey, 'locked', {
      NX: true,
      EX: 10
    });

    if (!acquired) {
      throw new Error('This slot is currently being booked by another user. Please try again in a few seconds.');
    }

    try {
      // Check for double booking in the database
      const isAlreadyBooked = await reservationRepository.findBySlot(
        date.day, 
        date.month, 
        date.year, 
        time
      );

      if (isAlreadyBooked) {
        throw new Error('This slot is already reserved.');
      }

      const newReservation = { 
        email, 
        firstName, 
        lastName, 
        date, 
        time, 
        timestamp: new Date().toISOString() 
      };

      return await reservationRepository.save(newReservation);
    } finally {
      // Release the lock
      await redisClient.del(lockKey);
    }
  }
}

module.exports = new ReservationService();
