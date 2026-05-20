const ethiopianCalendarService = require('../services/ethiopianCalendarService');
const dateConversionService = require('../services/dateConversionService');
const { ETHIOPIAN_MONTHS_EN, ETHIOPIAN_MONTHS_AM } = require('../utils/constants');

class CalendarController {
  // Get month calendar
  async getMonthCalendar(req, res, next) {
    try {
      const { year, month, locale = 'en' } = req.query;
      
      if (!year || !month) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year and month'
        });
      }
      
      const calendar = ethiopianCalendarService.generateMonthCalendar(
        parseInt(year), 
        parseInt(month), 
        locale
      );
      
      res.json({
        success: true,
        data: calendar
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get year calendar
  async getYearCalendar(req, res, next) {
    try {
      const { year, locale = 'en' } = req.query;
      
      if (!year) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year'
        });
      }
      
      const calendar = ethiopianCalendarService.generateYearCalendar(
        parseInt(year), 
        locale
      );
      
      res.json({
        success: true,
        data: calendar
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get day information
  async getDayInfo(req, res, next) {
    try {
      const { year, month, day, locale = 'en' } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const dayInfo = ethiopianCalendarService.getDayInfo(
        parseInt(year), 
        parseInt(month), 
        parseInt(day), 
        locale
      );
      
      res.json({
        success: true,
        data: dayInfo
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get week information
  async getWeekInfo(req, res, next) {
    try {
      const { year, month, day, locale = 'en' } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const weekdayInfo = ethiopianCalendarService.getWeekdayInfo(
        parseInt(year), 
        parseInt(month), 
        parseInt(day), 
        locale
      );
      
      const weekNumber = ethiopianCalendarService.getWeekNumber(
        parseInt(year), 
        parseInt(month), 
        parseInt(day)
      );
      
      res.json({
        success: true,
        data: {
          weekNumber,
          dayNumber: ethiopianCalendarService.getDayNumber(
            parseInt(year), 
            parseInt(month), 
            parseInt(day)
          ),
          weekday: weekdayInfo,
          isLeapYear: dateConversionService.isEthiopianLeapYear(parseInt(year))
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Validate Pagume
  async validatePagume(req, res, next) {
    try {
      const { year, day } = req.query;
      
      if (!year || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year and day'
        });
      }
      
      const validation = ethiopianCalendarService.validatePagume(
        parseInt(year), 
        parseInt(day)
      );
      
      res.json({
        success: true,
        data: validation
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CalendarController();