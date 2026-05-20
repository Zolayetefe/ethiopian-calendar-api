const holidaysData = require('../data/holidays.json');
const dateConversionService = require('./dateConversionService');
const ethiopianCalendarService = require('./ethiopianCalendarService');

class HolidayService {
  constructor() {
    this.holidays = holidaysData;
    this.cachedMovableHolidays = new Map();
    this.islamicHolidaysCache = new Map();
  }

  /**
   * CORRECTED: Calculate Fasika using JULIAN calendar algorithm
   * Ethiopian Orthodox Easter follows the Julian calendar
   */
  calculateFasika(year) {
    // Convert Ethiopian year to Julian year
    const julianYear = year + 7;
    
    // Julian Easter algorithm (Meeus/Jones/Butcher algorithm for Julian)
    const a = julianYear % 4;
    const b = julianYear % 7;
    const c = julianYear % 19;
    const d = (19 * c + 15) % 30;
    const e = (2 * a + 4 * b - d + 34) % 7;
    const month = Math.floor((d + e + 114) / 31);
    const day = ((d + e + 114) % 31) + 1;
    
    // Convert Julian date to Gregorian (Julian is currently 13 days behind)
    let gregorianYear = julianYear;
    let gregorianMonth = month;
    let gregorianDay = day;
    
    // Adjust from Julian to Gregorian (add 13 days for 20th-21st century)
    const gregorianDate = new Date(gregorianYear, gregorianMonth - 1, gregorianDay);
    gregorianDate.setDate(gregorianDate.getDate() + 13);
    
    gregorianYear = gregorianDate.getFullYear();
    gregorianMonth = gregorianDate.getMonth() + 1;
    gregorianDay = gregorianDate.getDate();
    
    // Convert to Ethiopian date
    const ethiopianEaster = dateConversionService.gregorianToEthiopian(
      gregorianYear,
      gregorianMonth,
      gregorianDay
    );
    
    return {
      ethiopian: ethiopianEaster,
      gregorian: { year: gregorianYear, month: gregorianMonth, day: gregorianDay },
      julian: { year: julianYear, month: month, day: day }
    };
  }

  /**
   * CORRECTED: Add days to Ethiopian date with proper Pagume handling
   */
  addDaysToDate(date, daysToAdd) {
    let { year, month, day } = date;
    let remainingDays = daysToAdd;
    
    while (remainingDays !== 0) {
      if (remainingDays > 0) {
        const daysInMonth = dateConversionService.getEthiopianMonthDays(year, month);
        const daysLeftInMonth = daysInMonth - day;
        
        if (remainingDays > daysLeftInMonth) {
          remainingDays -= (daysLeftInMonth + 1);
          day = 1;
          month++;
          if (month > 13) {
            month = 1;
            year++;
          }
        } else {
          day += remainingDays;
          remainingDays = 0;
        }
      } else {
  // Moving backwards
  if (day + remainingDays < 1) {
    remainingDays += day; // Absorb the days we've traveled back in the current month
    month--;
    if (month < 1) {
      month = 13;
      year--;
    }
    // Set 'day' to the last day of the new month and let the loop continue
    day = dateConversionService.getEthiopianMonthDays(year, month);
  } else {
    day += remainingDays;
    remainingDays = 0;
  }
}
    }
    
    return { year, month, day };
  }

  /**
   * CORRECTED: Get Orthodox movable holidays with correct offsets
   */
  getOrthodoxHolidays(year, locale = 'en') {
    const cacheKey = `orthodox:${year}:${locale}`;
    if (this.cachedMovableHolidays.has(cacheKey)) {
      return this.cachedMovableHolidays.get(cacheKey);
    }
    
    const fasika = this.calculateFasika(year);
    
    // Correct offsets based on Ethiopian Orthodox tradition
    const orthodoxHolidays = {
      'Sibket (Lent begins)': {
        ethiopian: this.addDaysToDate(fasika.ethiopian, -56),
        name_en: 'Sibket (Beginning of Great Lent)',
        name_am: 'ዐቢይ ጾም መጀመሪያ',
        offset: -56
      },
      'Hosanna (Palm Sunday)': {
        ethiopian: this.addDaysToDate(fasika.ethiopian, -7),
        name_en: 'Hosanna (Palm Sunday)',
        name_am: 'ሆሣዕና',
        offset: -7
      },
      'Siklet (Good Friday)': {
        ethiopian: this.addDaysToDate(fasika.ethiopian, -2),
        name_en: 'Siklet (Good Friday)',
        name_am: 'ስቅለት',
        offset: -2
      },
      'Fasika (Easter)': {
        ethiopian: fasika.ethiopian,
        name_en: 'Fasika (Ethiopian Easter Sunday)',
        name_am: 'ፋሲካ',
        offset: 0
      },
      'Fasika Monday': {
        ethiopian: this.addDaysToDate(fasika.ethiopian, 1),
        name_en: 'Fasika Monday (Easter Monday)',
        name_am: 'ፋሲካ ሰኞ',
        offset: 1
      },
      'Debre Zeyit (Ascension)': {
        ethiopian: this.addDaysToDate(fasika.ethiopian, 39),
        name_en: 'Debre Zeyit (Ascension Day)',
        name_am: 'ዕርገት',
        offset: 39
      },
      'Pentecost': {
        ethiopian: this.addDaysToDate(fasika.ethiopian, 49),
        name_en: 'Pentecost (Whitsunday)',
        name_am: 'ጰራቅሊጦስ',
        offset: 49
      }
    };
    
    // Fixed Orthodox holidays (corrected dates)
    const fixedOrthodox = {
      'Genna (Ethiopian Christmas)': {
        ethiopian: this.getCorrectedGennaDate(year),
        name_en: 'Genna (Ethiopian Orthodox Christmas)',
        name_am: 'ገና',
        offset: 0
      },
      'Timket (Epiphany)': {
        ethiopian: this.getCorrectedTimketDate(year),
        name_en: 'Timket (Epiphany)',
        name_am: 'ጥምቀት',
        offset: 0
      },
      'Lidet (Nativity)': {
        ethiopian: this.getCorrectedLidetDate(year),
        name_en: 'Lidet (Nativity of Jesus)',
        name_am: 'ልደት',
        offset: 0
      }
    };
    
    const allOrthodox = { ...orthodoxHolidays, ...fixedOrthodox };
    
    this.cachedMovableHolidays.set(cacheKey, allOrthodox);
    return allOrthodox;
  }

  /**
   * CORRECTED: Genna falls on Tahsas 28 or 29
   * Tahsas is month 4 in Ethiopian calendar
   */
  getCorrectedGennaDate(year) {
    // Genna is on Tahsas 28 (December 25th in Julian calendar)
    // Tahsas is month 4 (not month 10!)
    return { year, month: 4, day: 28 };
  }

  /**
   * CORRECTED: Timket falls on Tir 11
   * Tir is month 5 in Ethiopian calendar
   */
  getCorrectedTimketDate(year) {
    // Timket is on Tir 11 (January 18th-19th in Gregorian)
    // Tir is month 5 (not month 11!)
    return { year, month: 5, day: 11 };
  }

  /**
   * CORRECTED: Lidet is on Tahsas 28
   */
  getCorrectedLidetDate(year) {
    return { year, month: 4, day: 28 };
  }

  /**
   * Get fixed holidays for a specific date
   */
  getFixedHoliday(year, month, day, locale = 'en') {
    const holidays = this.holidays.fixed_holidays[locale];
    
    if (holidays[month] && holidays[month][day.toString()]) {
      return {
        isHoliday: true,
        name: holidays[month][day.toString()],
        type: 'fixed'
      };
    }
    
    return { isHoliday: false };
  }

  /**
   * Check if date is an Orthodox holiday
   */
  isOrthodoxHoliday(year, month, day, locale = 'en') {
    const orthodoxHolidays = this.getOrthodoxHolidays(year, locale);
    
    for (const [name, holiday] of Object.entries(orthodoxHolidays)) {
      if (holiday.ethiopian.month === month && holiday.ethiopian.day === day) {
        return {
          isHoliday: true,
          name: locale === 'am' ? holiday.name_am : holiday.name_en,
          type: 'orthodox',
          holidayName: name
        };
      }
    }
    
    return { isHoliday: false };
  }

  /**
   * Islamic holidays are NEVER fixed - calculate dynamically
   */
  async getIslamicHolidays(year, month, day) {
    // This should call an external API or use astronomical calculations
    // For now, return a warning
    return {
      warning: "Islamic holidays are lunar-based and cannot be fixed. Please use an external Islamic calendar API.",
      isHoliday: false
    };
  }

  /**
   * CORRECTED: Ethiopian weekend (Saturday is first day)
   */
  isWeekend(year, month, day) {
    const gregorian = dateConversionService.ethiopianToGregorian(year, month, day);
    const date = new Date(gregorian.year, gregorian.month - 1, gregorian.day);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // In Ethiopia, Saturday is considered first day and weekend
    // Sunday is also weekend
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  /**
   * Comprehensive holiday check
   */
  isHoliday(year, month, day, locale = 'en') {
    if (!dateConversionService.isValidEthiopianDate(year, month, day)) {
      throw new Error(`Invalid Ethiopian date: ${year}-${month}-${day}`);
    }
    
    const isWeekendDay = this.isWeekend(year, month, day);
    
    // Check fixed holidays
    const fixedHoliday = this.getFixedHoliday(year, month, day, locale);
    if (fixedHoliday.isHoliday) {
      return {
        isHoliday: true,
        name: fixedHoliday.name,
        type: fixedHoliday.type,
        isWeekend: isWeekendDay,
        isWorkingDay: false
      };
    }
    
    // Check Orthodox holidays
    const orthodoxHoliday = this.isOrthodoxHoliday(year, month, day, locale);
    if (orthodoxHoliday.isHoliday) {
      return {
        isHoliday: true,
        name: orthodoxHoliday.name,
        type: orthodoxHoliday.type,
        isWeekend: isWeekendDay,
        isWorkingDay: false
      };
    }
    
    return {
      isHoliday: false,
      isWeekend: isWeekendDay,
      isWorkingDay: !isWeekendDay
    };
  }

  /**
   * Get all holidays for a year (no duplicates)
   */
  getAllHolidays(year, locale = 'en') {
    const holidays = [];
    const seenDates = new Set();
    
    // Add fixed holidays
    const fixedHolidays = this.holidays.fixed_holidays[locale];
    for (const month in fixedHolidays) {
      for (const day in fixedHolidays[month]) {
        const monthNum = parseInt(month);
        const dayNum = parseInt(day);
        
        if (dayNum <= dateConversionService.getEthiopianMonthDays(year, monthNum)) {
          const dateKey = `${monthNum}-${dayNum}`;
          if (!seenDates.has(dateKey)) {
            seenDates.add(dateKey);
            holidays.push({
              date: { year, month: monthNum, day: dayNum },
              name: fixedHolidays[month][day],
              type: 'fixed',
              gregorian: dateConversionService.ethiopianToGregorian(year, monthNum, dayNum)
            });
          }
        }
      }
    }
    
    // Add Orthodox holidays (no duplicates)
    const orthodoxHolidays = this.getOrthodoxHolidays(year, locale);
    for (const [holidayName, holidayData] of Object.entries(orthodoxHolidays)) {
      const { year: hYear, month: hMonth, day: hDay } = holidayData.ethiopian;
      const dateKey = `${hMonth}-${hDay}`;
      
      if (!seenDates.has(dateKey) && hYear === year) {
        seenDates.add(dateKey);
        holidays.push({
          date: { year: hYear, month: hMonth, day: hDay },
          name: locale === 'am' ? holidayData.name_am : holidayData.name_en,
          type: 'orthodox',
          holidayName: holidayName,
          offset: holidayData.offset,
          gregorian: dateConversionService.ethiopianToGregorian(hYear, hMonth, hDay)
        });
      }
    }
    
    // Sort by date
    holidays.sort((a, b) => {
      if (a.date.month !== b.date.month) return a.date.month - b.date.month;
      return a.date.day - b.date.day;
    });
    
    return {
      year,
      totalHolidays: holidays.length,
      holidays
    };
  }

  /**
   * Get upcoming holidays with proper year transition
   */
  getUpcomingHolidays(year, month, day, limit = 10, locale = 'en') {
    if (!dateConversionService.isValidEthiopianDate(year, month, day)) {
      throw new Error(`Invalid Ethiopian date: ${year}-${month}-${day}`);
    }
    
    const currentJDN = dateConversionService.ethiopianToJDN(year, month, day);
    let allHolidays = [...this.getAllHolidays(year, locale).holidays];
    
    // Also get next year's holidays for year boundary
    const nextYearHolidays = this.getAllHolidays(year + 1, locale).holidays;
    allHolidays = [...allHolidays, ...nextYearHolidays];
    
    // Filter and sort
    const upcoming = allHolidays
      .map(holiday => {
        const holidayJDN = dateConversionService.ethiopianToJDN(
          holiday.date.year,
          holiday.date.month,
          holiday.date.day
        );
        const daysUntil = holidayJDN - currentJDN;
        
        // Only include future holidays (daysUntil >= 0)
        if (daysUntil >= 0) {
          return { ...holiday, daysUntil };
        }
        return null;
      })
      .filter(h => h !== null)
      .sort((a, b) => a.daysUntil - b.daysUntil);
    
    return upcoming.slice(0, limit);
  }

  /**
   * Get next immediate holiday
   */
  getNextHoliday(year, month, day, locale = 'en') {
    const upcoming = this.getUpcomingHolidays(year, month, day, 1, locale);
    return upcoming[0] || null;
  }

  /**
   * Check if date range contains any holidays
   */
  hasHolidayInRange(startYear, startMonth, startDay, endYear, endMonth, endDay, locale = 'en') {
    const startJDN = dateConversionService.ethiopianToJDN(startYear, startMonth, startDay);
    const endJDN = dateConversionService.ethiopianToJDN(endYear, endMonth, endDay);
    
    if (startJDN > endJDN) {
      throw new Error('Start date must be before end date');
    }
    
    // Get holidays for all years in range
    let allHolidays = [];
    for (let year = startYear; year <= endYear; year++) {
      const yearHolidays = this.getAllHolidays(year, locale).holidays;
      allHolidays = [...allHolidays, ...yearHolidays];
    }
    
    for (const holiday of allHolidays) {
      const holidayJDN = dateConversionService.ethiopianToJDN(
        holiday.date.year,
        holiday.date.month,
        holiday.date.day
      );
      
      if (holidayJDN >= startJDN && holidayJDN <= endJDN) {
        return {
          hasHoliday: true,
          holiday: holiday
        };
      }
    }
    
    return { hasHoliday: false };
  }
}

module.exports = new HolidayService();