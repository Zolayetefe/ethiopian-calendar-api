const express = require('express');
const router = express.Router();
const conversionController = require('../controllers/conversionController');

router.get('/gregorian-to-ethiopian', conversionController.gregorianToEthiopian);
router.get('/ethiopian-to-gregorian', conversionController.ethiopianToGregorian);
router.get('/today', conversionController.today);

module.exports = router;