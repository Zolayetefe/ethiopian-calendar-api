const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.get('/month-calendar', calendarController.getMonthCalendar);
router.get('/year-calendar', calendarController.getYearCalendar);
router.get('/day-info', calendarController.getDayInfo);
router.get('/week-info', calendarController.getWeekInfo);
router.get('/validate-pagume', calendarController.validatePagume);

module.exports = router;