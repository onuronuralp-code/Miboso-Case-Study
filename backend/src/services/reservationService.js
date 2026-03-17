const reservationRepository = require('../repositories/reservationRepository');

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

    // Check for double booking
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
  }
}

module.exports = new ReservationService();
