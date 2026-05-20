const dateConversionService = require('./dateConversionService');
const { 
  ETHIOPIAN_MONTHS_EN, 
  ETHIOPIAN_MONTHS_AM,
  WEEKDAYS_EN,
  WEEKDAYS_AM
} = require('../utils/constants');

class EthiopianCalendarService {
  
  // FIXED: Correctly calculates day number in the year (removed redundant code)
  getDayNumber(year, month, day) {
    return (month - 1) * 30 + day;
  }

  // FIXED: Tracks week numbers relative to the Ethiopian New Year (Meskerem 1)
  getWeekNumber(year, month, day) {
    const dayNumber = this.getDayNumber(year, month, day);
    const firstDayIndex = this.getWeekdayIndex(year, 1, 1); // Get weekday of Meskerem 1
    
    return Math.ceil((dayNumber + firstDayIndex) / 7);
  }

  // Internal helper to get raw weekday index (0 = Sunday, 6 = Saturday) safely using UTC
  getWeekdayIndex(year, month, day) {
    const g = dateConversionService.ethiopianToGregorian(year, month, day);
    // Use Date.UTC to protect against hosting server timezone shifts
    const date = new Date(Date.UTC(g.year, g.month - 1, g.day));
    return date.getUTCDay();
  }

  // Get weekday name metadata
  getWeekdayInfo(year, month, day, locale = 'en') {
    const weekdayIndex = this.getWeekdayIndex(year, month, day);
    const weekdayNames = locale === 'am' ? WEEKDAYS_AM : WEEKDAYS_EN;
    
    return {
      index: weekdayIndex,
      name: weekdayNames[weekdayIndex],
      isWeekend: weekdayIndex === 0 || weekdayIndex === 6
    };
  }

  // OPTIMIZED: Uses single anchor calculations instead of conversions inside loops
  generateMonthCalendar(year, month, locale = 'en') {
    if (month < 1 || month > 13) throw new Error('Month must be between 1 and 13');
    
    const daysInMonth = dateConversionService.getEthiopianMonthDays(year, month);
    const monthNames = locale === 'am' ? ETHIOPIAN_MONTHS_AM : ETHIOPIAN_MONTHS_EN;
    const weekdayNames = locale === 'am' ? WEEKDAYS_AM : WEEKDAYS_EN;
    const isLeap = dateConversionService.isEthiopianLeapYear(year);
    
    // Calculate anchor parameters once for the entire month loop
    const startWeekdayIndex = this.getWeekdayIndex(year, month, 1);
    const firstDayOfYearNumber = this.getDayNumber(year, month, 1);
    const firstDayOfWeekNumber = this.getWeekNumber(year, month, 1);
    
    const calendar = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const currentWeekdayIndex = (startWeekdayIndex + day - 1) % 7;
      const dayOffset = day - 1;
      
      calendar.push({
        day: day,
        weekday: weekdayNames[currentWeekdayIndex],
        isWeekend: currentWeekdayIndex === 0 || currentWeekdayIndex === 6,
        dayNumber: firstDayOfYearNumber + dayOffset,
        // Weeks increment safely whenever a Sunday (0) rolls around
        weekNumber: firstDayOfWeekNumber + Math.floor((startWeekdayIndex + dayOffset) / 7)
      });
    }
    
    return {
      year,
      month: { number: month, name: monthNames[month - 1] },
      isLeapYear: isLeap,
      daysInMonth,
      calendar,
      pagumeValidation: month === 13 ? {
        isLeapYear: isLeap,
        pagumeDays: isLeap ? 6 : 5,
        pagume6Valid: isLeap
      } : null
    };
  }

  // OPTIMIZED & ENHANCED: Generates complete UI-friendly padded calendar weeks
  generateYearCalendar(year, locale = 'en') {
    const isLeap = dateConversionService.isEthiopianLeapYear(year);
    const monthNames = locale === 'am' ? ETHIOPIAN_MONTHS_AM : ETHIOPIAN_MONTHS_EN;
    const weekdayNames = locale === 'am' ? WEEKDAYS_AM : WEEKDAYS_EN;
    
    const yearCalendar = { year, isLeapYear: isLeap, months: [] };
    
    for (let month = 1; month <= 13; month++) {
      const daysInMonth = dateConversionService.getEthiopianMonthDays(year, month);
      const startWeekdayIndex = this.getWeekdayIndex(year, month, 1);
      
      const monthData = {
        monthNumber: month,
        monthName: monthNames[month - 1],
        daysInMonth,
        weeks: []
      };
      
      let currentWeek = [];
      
      // FEATURE: Pad the first week with nulls for empty preceding column spaces
      for (let pad = 0; pad < startWeekdayIndex; pad++) {
        currentWeek.push(null); 
      }
      
      for (let day = 1; day <= daysInMonth; day++) {
        const currentWeekdayIndex = (startWeekdayIndex + day - 1) % 7;
        
        currentWeek.push({
          day,
          weekday: weekdayNames[currentWeekdayIndex],
          isWeekend: currentWeekdayIndex === 0 || currentWeekdayIndex === 6
        });
        
        // Push week on Saturday (6) or last day of the month
        if (currentWeekdayIndex === 6 || day === daysInMonth) {
          // If it's the last day of the month, pad trailing empty spots up to Saturday
          if (day === daysInMonth && currentWeekdayIndex < 6) {
            while (currentWeek.length < 7) currentWeek.push(null);
          }
          monthData.weeks.push(currentWeek);
          currentWeek = [];
        }
      }
      
      yearCalendar.months.push(monthData);
    }
    
    return yearCalendar;
  }

  // Comprehensive day information mapper
  getDayInfo(year, month, day, locale = 'en') {
    if (month < 1 || month > 13) throw new Error('Invalid month');
    if (day < 1 || day > dateConversionService.getEthiopianMonthDays(year, month)) {
      throw new Error('Invalid day');
    }
    
    const weekdayInfo = this.getWeekdayInfo(year, month, day, locale);
    const gregorian = dateConversionService.ethiopianToGregorian(year, month, day);
    const monthNames = locale === 'am' ? ETHIOPIAN_MONTHS_AM : ETHIOPIAN_MONTHS_EN;
    const isLeap = dateConversionService.isEthiopianLeapYear(year);
    
    return {
      ethiopian: {
        year,
        month: { number: month, name: monthNames[month - 1] },
        day,
        dayNumber: this.getDayNumber(year, month, day),
        weekNumber: this.getWeekNumber(year, month, day),
        weekday: weekdayInfo.name,
        isWeekend: weekdayInfo.isWeekend,
        isLeapYear: isLeap
      },
      gregorian: {
        year: gregorian.year,
        month: gregorian.month,
        day: gregorian.day
      },
      pagumeValidation: month === 13 ? {
        isValid: day <= (isLeap ? 6 : 5),
        maxDay: isLeap ? 6 : 5,
        isLeapYear: isLeap
      } : null
    };
  }

  // Simple boundary validation rule tool
  validatePagume(year, day) {
    const isLeap = dateConversionService.isEthiopianLeapYear(year);
    const maxPagumeDay = isLeap ? 6 : 5;
    
    return {
      isValid: day >= 1 && day <= maxPagumeDay,
      isLeapYear: isLeap,
      maxDay: maxPagumeDay,
      pagume5Valid: maxPagumeDay >= 5,
      pagume6Valid: isLeap && maxPagumeDay >= 6
    };
  }
}

module.exports = new EthiopianCalendarService();