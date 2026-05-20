const express = require('express');
const router = express.Router();
const holidayController = require('../controllers/holidayController');

router.get('/all', holidayController.getAllHolidays);
router.get('/check', holidayController.checkHoliday);
router.get('/upcoming', holidayController.getUpcomingHolidays);
router.get('/religious', holidayController.getReligiousHolidays);
router.get('/fasika', holidayController.getFasikaDate);

module.exports = router;