const express = require('express');
const router = express.Router();
const businessDateController = require('../controllers/businessDateController');

router.get('/check-working-day', businessDateController.checkWorkingDay);
router.get('/working-days-between', businessDateController.calculateWorkingDays);
router.get('/next-working-day', businessDateController.nextWorkingDay);
router.get('/previous-working-day', businessDateController.previousWorkingDay);
router.get('/settlement-date', businessDateController.settlementDate);
router.get('/fiscal-year', businessDateController.fiscalYearInfo);
router.get('/working-days-list', businessDateController.getWorkingDaysList);

module.exports = router;