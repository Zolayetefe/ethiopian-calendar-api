const dateConversionService = require('./dateConversionService');
const holidayService = require('./holidayService');
const ethiopianCalendarService = require('./ethiopianCalendarService');

class BusinessDateService {
  constructor() {
    this.WORKING_DAYS = [1, 2, 3, 4, 5]; // Monday to Friday
    this.BANKING_SETTLEMENT_DAYS = 2; // T+2 settlement
    // FIXED: Real Ethiopian Fiscal Year starts on Hamle 1 (Month 11)
    this.FISCAL_YEAR_START_MONTH = 11; 
  }

  // Check if a date is a working day (not weekend and not holiday)
  isWorkingDay(year, month, day, considerHolidays = true) {
    const isWeekend = holidayService.isWeekend(year, month, day);
    if (isWeekend) return false;
    
    if (considerHolidays) {
      const holiday = holidayService.isHoliday(year, month, day);
      if (holiday.isHoliday) return false;
    }
    
    return true;
  }

  // Get business day status with details
  getBusinessDayStatus(year, month, day, options = {}) {
    const { includeHolidayDetails = true } = options;
    
    const isWeekend = holidayService.isWeekend(year, month, day);
    const holidayInfo = includeHolidayDetails ? holidayService.isHoliday(year, month, day) : null;
    const isWorking = this.isWorkingDay(year, month, day, includeHolidayDetails);
    
    const status = {
      date: { year, month, day },
      isWorkingDay: isWorking,
      isWeekend,
      status: isWorking ? 'WORKING_DAY' : (isWeekend ? 'WEEKEND' : 'HOLIDAY')
    };
    
    if (holidayInfo && holidayInfo.isHoliday) {
      status.holiday = {
        name: holidayInfo.name,
        type: holidayInfo.type
      };
    }
    
    return status;
  }

  // FIXED: Resolved the const reassignment crash and streamlined calculation via JDN loop
  calculateWorkingDays(startDate, endDate, excludeHolidays = true) {
    const startJDN = dateConversionService.ethiopianToJDN(startDate.year, startDate.month, startDate.day);
    const endJDN = dateConversionService.ethiopianToJDN(endDate.year, endDate.month, endDate.day);
    
    if (startJDN > endJDN) {
      throw new Error('Start date must be before end date');
    }
    
    let workingDays = 0;
    
    for (let currentJDN = startJDN; currentJDN <= endJDN; currentJDN++) {
      const currentDate = dateConversionService.jdnToEthiopian(currentJDN);
      if (this.isWorkingDay(currentDate.year, currentDate.month, currentDate.day, excludeHolidays)) {
        workingDays++;
      }
    }
    
    return {
      workingDays,
      totalDays: endJDN - startJDN + 1,
      excludeHolidays
    };
  }

  // FIXED: Replaced brittle manual month math with clean, sequential JDN increments
  findNextWorkingDay(year, month, day, daysToAdd = 1, excludeHolidays = true) {
    let currentJDN = dateConversionService.ethiopianToJDN(year, month, day);
    let daysFound = 0;
    let daysSkipped = 0;
    
    while (daysFound < daysToAdd) {
      currentJDN++;
      daysSkipped++;
      
      const currentDate = dateConversionService.jdnToEthiopian(currentJDN);
      if (this.isWorkingDay(currentDate.year, currentDate.month, currentDate.day, excludeHolidays)) {
        daysFound++;
      }
    }
    
    const finalDate = dateConversionService.jdnToEthiopian(currentJDN);
    return {
      workingDate: { year: finalDate.year, month: finalDate.month, day: finalDate.day },
      daysSkipped,
      gregorian: dateConversionService.ethiopianToGregorian(finalDate.year, finalDate.month, finalDate.day)
    };
  }

  // FIXED: Substituted fragile reverse month calculations with JDN decrements
  findPreviousWorkingDay(year, month, day, daysToSubtract = 1, excludeHolidays = true) {
    let currentJDN = dateConversionService.ethiopianToJDN(year, month, day);
    let daysFound = 0;
    let daysSkipped = 0;
    
    while (daysFound < daysToSubtract) {
      currentJDN--;
      daysSkipped++;
      
      const currentDate = dateConversionService.jdnToEthiopian(currentJDN);
      if (this.isWorkingDay(currentDate.year, currentDate.month, currentDate.day, excludeHolidays)) {
        daysFound++;
      }
    }
    
    const finalDate = dateConversionService.jdnToEthiopian(currentJDN);
    return {
      workingDate: { year: finalDate.year, month: finalDate.month, day: finalDate.day },
      daysSkipped,
      gregorian: dateConversionService.ethiopianToGregorian(finalDate.year, finalDate.month, finalDate.day)
    };
  }

  // Calculate settlement date (banking)
  calculateSettlementDate(year, month, day, settlementDays = this.BANKING_SETTLEMENT_DAYS) {
    const settlementDate = this.findNextWorkingDay(year, month, day, settlementDays, true);
    
    return {
      transactionDate: { year, month, day },
      settlementDate: settlementDate.workingDate,
      settlementDays,
      gregorianSettlement: settlementDate.gregorian,
      isWorkingDay: this.isWorkingDay(year, month, day, true)
    };
  }

  // FIXED: Adjusted fiscal parsing structures to map onto Hamle-based quarters
  getFiscalYearInfo(date) {
    const { year, month } = date;
    
    let fiscalYear;
    let fiscalYearStart;
    let fiscalYearEnd;
    let quarter;
    let monthInFiscalYear;
    
    // If month is Hamle (11), Nehase (12), or Pagume (13)
    if (month >= this.FISCAL_YEAR_START_MONTH) {
      fiscalYear = year;
      fiscalYearStart = { year, month: 11, day: 1 };
      fiscalYearEnd = { year: year + 1, month: 10, day: 30 };
      monthInFiscalYear = month - 11 + 1; // Hamle = 1, Nehase = 2, Pagume = 3
      quarter = 1; // Q1 spans Hamle, Nehase, Meskerem
    } else {
      fiscalYear = year - 1;
      fiscalYearStart = { year: year - 1, month: 11, day: 1 };
      fiscalYearEnd = { year, month: 10, day: 30 };
      monthInFiscalYear = month + 3; // Meskerem = 4, Tikimt = 5, etc.
      
      // Determine Quarter sequence relative to Hamle
      if (month === 1) quarter = 1; // Meskerem finishes Q1
      else if (month >= 2 && month <= 4) quarter = 2; // Tikimt, Hidar, Tahsas
      else if (month >= 5 && month <= 7) quarter = 3; // Tir, Yekatit, Megabit
      else quarter = 4; // Miyazya, Ginbot, Sene
    }
    
    return {
      fiscalYear,
      fiscalQuarter: quarter,
      fiscalYearStart,
      fiscalYearEnd,
      monthInFiscalYear,
      daysInFiscalYear: this.calculateWorkingDays(fiscalYearStart, fiscalYearEnd, false).totalDays
    };
  }

  // FIXED: Cleaned up looping metrics to leverage the sequential JDN pipeline safely
  getWorkingDaysBetween(startDate, endDate, excludeHolidays = true) {
    const workingDaysList = [];
    const startJDN = dateConversionService.ethiopianToJDN(startDate.year, startDate.month, startDate.day);
    const endJDN = dateConversionService.ethiopianToJDN(endDate.year, endDate.month, endDate.day);
    
    if (startJDN > endJDN) {
      throw new Error('Start date must be before end date');
    }
    
    for (let currentJDN = startJDN; currentJDN <= endJDN; currentJDN++) {
      const currentDate = dateConversionService.jdnToEthiopian(currentJDN);
      if (this.isWorkingDay(currentDate.year, currentDate.month, currentDate.day, excludeHolidays)) {
        workingDaysList.push({
          date: { year: currentDate.year, month: currentDate.month, day: currentDate.day },
          gregorian: dateConversionService.ethiopianToGregorian(currentDate.year, currentDate.month, currentDate.day),
          status: this.getBusinessDayStatus(currentDate.year, currentDate.month, currentDate.day)
        });
      }
    }
    
    return workingDaysList;
  }

  // Batch check multiple dates
  batchCheckWorkingDays(dates) {
    return dates.map(date => 
      this.getBusinessDayStatus(date.year, date.month, date.day)
    );
  }
}

module.exports = new BusinessDateService();