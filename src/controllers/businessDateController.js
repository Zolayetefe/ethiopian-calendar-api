const businessDateService = require('../services/businessDateService');
const dateConversionService = require('../services/dateConversionService');

class BusinessDateController {
  // Check if date is working day
  async checkWorkingDay(req, res, next) {
    try {
      const { year, month, day, includeHolidayDetails = 'true' } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const status = businessDateService.getBusinessDayStatus(
        parseInt(year),
        parseInt(month),
        parseInt(day),
        { includeHolidayDetails: includeHolidayDetails === 'true' }
      );
      
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Calculate working days between two dates
  async calculateWorkingDays(req, res, next) {
    try {
      const { startYear, startMonth, startDay, endYear, endMonth, endDay, excludeHolidays = 'true' } = req.query;
      
      if (!startYear || !startMonth || !startDay || !endYear || !endMonth || !endDay) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide start and end dates'
        });
      }
      
      const workingDays = businessDateService.calculateWorkingDays(
        { year: parseInt(startYear), month: parseInt(startMonth), day: parseInt(startDay) },
        { year: parseInt(endYear), month: parseInt(endMonth), day: parseInt(endDay) },
        excludeHolidays === 'true'
      );
      
      res.json({
        success: true,
        data: {
          startDate: { year: parseInt(startYear), month: parseInt(startMonth), day: parseInt(startDay) },
          endDate: { year: parseInt(endYear), month: parseInt(endMonth), day: parseInt(endDay) },
          ...workingDays
        }
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Find next working day
  async nextWorkingDay(req, res, next) {
    try {
      const { year, month, day, daysToAdd = '1', excludeHolidays = 'true' } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const nextWorkingDay = businessDateService.findNextWorkingDay(
        parseInt(year),
        parseInt(month),
        parseInt(day),
        parseInt(daysToAdd),
        excludeHolidays === 'true'
      );
      
      res.json({
        success: true,
        data: nextWorkingDay
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Find previous working day
  async previousWorkingDay(req, res, next) {
    try {
      const { year, month, day, daysToSubtract = '1', excludeHolidays = 'true' } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const previousWorkingDay = businessDateService.findPreviousWorkingDay(
        parseInt(year),
        parseInt(month),
        parseInt(day),
        parseInt(daysToSubtract),
        excludeHolidays === 'true'
      );
      
      res.json({
        success: true,
        data: previousWorkingDay
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Calculate settlement date
  async settlementDate(req, res, next) {
    try {
      const { year, month, day, settlementDays = '2' } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const settlement = businessDateService.calculateSettlementDate(
        parseInt(year),
        parseInt(month),
        parseInt(day),
        parseInt(settlementDays)
      );
      
      res.json({
        success: true,
        data: settlement
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get fiscal year information
  async fiscalYearInfo(req, res, next) {
    try {
      const { year, month, day } = req.query;
      
      if (!year || !month || !day) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide year, month, and day'
        });
      }
      
      const fiscalInfo = businessDateService.getFiscalYearInfo({
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day)
      });
      
      res.json({
        success: true,
        data: fiscalInfo
      });
    } catch (error) {
      next(error);
    }
  }
  
  // Get all working days between dates
  async getWorkingDaysList(req, res, next) {
    try {
      const { startYear, startMonth, startDay, endYear, endMonth, endDay, excludeHolidays = 'true' } = req.query;
      
      if (!startYear || !startMonth || !startDay || !endYear || !endMonth || !endDay) {
        return res.status(400).json({
          error: 'Missing parameters',
          message: 'Please provide start and end dates'
        });
      }
      
      const workingDaysList = businessDateService.getWorkingDaysBetween(
        { year: parseInt(startYear), month: parseInt(startMonth), day: parseInt(startDay) },
        { year: parseInt(endYear), month: parseInt(endMonth), day: parseInt(endDay) },
        excludeHolidays === 'true'
      );
      
      res.json({
        success: true,
        data: {
          startDate: { year: parseInt(startYear), month: parseInt(startMonth), day: parseInt(startDay) },
          endDate: { year: parseInt(endYear), month: parseInt(endMonth), day: parseInt(endDay) },
          totalWorkingDays: workingDaysList.length,
          workingDays: workingDaysList
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BusinessDateController();