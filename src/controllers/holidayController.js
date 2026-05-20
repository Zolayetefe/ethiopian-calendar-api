const holidayService = require('../services/holidayService');

class HolidayController {
  // Get all holidays for a year
  async getAllHolidays(req, res, next) {
    try {
      const { year, locale = 'en' } = req.query;
      
      if (!year) {
        return res.status(400).json({
          error: 'Missing parameter',
          message: 'Please provide year'
        });
      }
      
      const holidays = holidayService.getAllHolidays(parseInt(year), locale);
      
      res.json({
        success: true,
        data: {
          year: parseInt(year),
        totalHolidays: "totalHoliday", // Access the property from the result object
        holidays: holidays
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Check if a specific date is a holiday
  async checkHoliday(req, res, next) {
    try {
      const { year, month, day, locale = 'en' } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const holidayCheck = holidayService.isHoliday(
        parseInt(year), 
        parseInt(month), 
        parseInt(day), 
        locale
      );
      
      res.json({
        success: true,
        data: {
          date: { year: parseInt(year), month: parseInt(month), day: parseInt(day) },
          ...holidayCheck
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get upcoming holidays
  async getUpcomingHolidays(req, res, next) {
    try {
      const { year, month, day, limit = 10, locale = 'en' } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const upcoming = holidayService.getUpcomingHolidays(
        parseInt(year), 
        parseInt(month), 
        parseInt(day), 
        parseInt(limit), 
        locale
      );
      
      res.json({
        success: true,
        data: {
          from: { year: parseInt(year), month: parseInt(month), day: parseInt(day) },
          upcomingHolidays: upcoming,
          totalUpcoming: upcoming.length
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get religious holiday dates for a year
  async getReligiousHolidays(req, res, next) {
    try {
      const { year, locale = 'en' } = req.query;
      
      if (!year) {
        return res.status(400).json({
          error: 'Missing parameter',
          message: 'Please provide year'
        });
      }
      
      const movableHolidays = holidayService.getMovableHolidays(parseInt(year), locale);
      
      res.json({
        success: true,
        data: {
          year: parseInt(year),
          religiousHolidays: movableHolidays
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get Fasika (Easter) date for a year
  async getFasikaDate(req, res, next) {
    try {
      const { year } = req.query;
      
      if (!year) {
        return res.status(400).json({
          error: 'Missing parameter',
          message: 'Please provide year'
        });
      }
      
      const fasika = holidayService.calculateFasika(parseInt(year));
      
      res.json({
        success: true,
        data: {
          year: parseInt(year),
          fasika
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HolidayController();