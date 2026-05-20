const dateConversionService = require('../services/dateConversionService');
const { ETHIOPIAN_MONTHS_EN, ETHIOPIAN_MONTHS_AM } = require('../utils/constants');

class ConversionController {
  // Gregorian to Ethiopian conversion
  async gregorianToEthiopian(req, res, next) {
    try {
      const { year, month, day } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const ethiopianDate = dateConversionService.gregorianToEthiopian(
        parseInt(year), 
        parseInt(month), 
        parseInt(day)
      );
      
      res.json({
        success: true,
        data: {
          gregorian: { year: parseInt(year), month: parseInt(month), day: parseInt(day) },
          ethiopian: ethiopianDate
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Ethiopian to Gregorian conversion
  async ethiopianToGregorian(req, res, next) {
    try {
      const { year, month, day } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const gregorianDate = dateConversionService.ethiopianToGregorian(
        parseInt(year), 
        parseInt(month), 
        parseInt(day)
      );
      
      res.json({
        success: true,
        data: {
          ethiopian: { year: parseInt(year), month: parseInt(month), day: parseInt(day) },
          gregorian: gregorianDate
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Today's date endpoint
  async today(req, res, next) {
    try {
      const currentDate = dateConversionService.getCurrentDate();
      const locale = req.query.locale || 'en';
      
      const monthNames = locale === 'am' ? ETHIOPIAN_MONTHS_AM : ETHIOPIAN_MONTHS_EN;
      
      res.json({
        success: true,
        data: {
          gregorian: currentDate.gregorian,
          ethiopian: {
            ...currentDate.ethiopian,
            monthName: monthNames[currentDate.ethiopian.month - 1]
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ConversionController();