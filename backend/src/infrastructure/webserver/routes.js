const express = require('express');
const router = express.Router();
const reservationService = require('../../services/reservationService');

// Debug middleware
router.use((req, res, next) => {
  console.log(`[Backend] ${req.method} ${req.originalUrl}`);
  next();
});

router.get('/reservations', async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/reservation', async (req, res) => {
  try {
    const result = await reservationService.createReservation(req.body);
    
    console.log('--- Reservation Logged (Service Layer) ---');
    console.log(`Name: ${result.firstName} ${result.lastName}`);
    console.log(`Email: ${result.email}`);
    console.log(`Date: ${JSON.stringify(result.date)}`);
    console.log(`Time: ${result.time}`);
    console.log('------------------------------------------');

    res.json({
      success: true,
      message: 'Reservation received and saved',
      data: result
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
