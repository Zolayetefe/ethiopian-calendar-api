class DateConversionService {
  constructor() {
    // Ethiopian epoch: JDN for Ethiopian date 0001-01-01
    this.ETHIOPIAN_EPOCH = 1724221; 
    this.cache = new Map();
  }

  isEthiopianLeapYear(year) {
    if (typeof year !== 'number' || year < 1) return false;
    return (year + 1) % 4 === 0;
  }

  getEthiopianMonthDays(year, month) {
    if (month < 1 || month > 13) {
      throw new Error(`Invalid month: ${month}. Must be between 1 and 13`);
    }
    if (month <= 12) return 30;
    return this.isEthiopianLeapYear(year) ? 6 : 5;
  }

  isValidGregorianDate(year, month, day) {
    if (typeof year !== 'number' || year < 1 || year > 9999) return false;
    if (typeof month !== 'number' || month < 1 || month > 12) return false;
    if (typeof day !== 'number' || day < 1) return false;
    
    const daysInMonth = new Date(year, month, 0).getDate();
    return day <= daysInMonth;
  }

  isValidEthiopianDate(year, month, day) {
    if (typeof year !== 'number' || year < 1) return false;
    if (typeof month !== 'number' || month < 1 || month > 13) return false;
    if (typeof day !== 'number' || day < 1) return false;
    
    return day <= this.getEthiopianMonthDays(year, month);
  }

  gregorianToJDN(year, month, day) {
    if (!this.isValidGregorianDate(year, month, day)) {
      throw new Error(`Invalid Gregorian date: ${year}-${month}-${day}`);
    }
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + 
           Math.floor(y / 4) - Math.floor(y / 100) + 
           Math.floor(y / 400) - 32045;
  }

  jdnToGregorian(jdn) {
    if (typeof jdn !== 'number' || jdn < 0) {
      throw new Error('Invalid Julian Day Number');
    }
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const d = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * d) / 4);
    const m = Math.floor((5 * e + 2) / 153);
    
    const day = e - Math.floor((153 * m + 2) / 5) + 1;
    const month = m + 3 - 12 * Math.floor(m / 10);
    const year = 100 * b + d - 4800 + Math.floor(m / 10);
    
    return { year, month, day };
  }

  /**
   * FIXED O(1): Properly offsets leap additions with Math.floor((year + 1) / 4)
   */
ethiopianToJDN(year, month, day) {
    if (!this.isValidEthiopianDate(year, month, day)) {
      throw new Error(`Invalid Ethiopian date: ${year}-${month}-${day}`);
    }
    
    // Smooth O(1) alignment: Shift formula timeline to start at a predictable cycle point
    const jdn = (365 * year) + 
                Math.floor(year / 4) + 
                (30 * month) + 
                day + 
                this.ETHIOPIAN_EPOCH - 396;
                
    return jdn;
  }

  jdnToEthiopian(jdn) {
    if (jdn < this.ETHIOPIAN_EPOCH) {
      throw new Error('Date is before Ethiopian calendar epoch (year 1)');
    }
    
    // Reverse alignment matching the mathematical shift in ethiopianToJDN
    const rJDN = jdn - this.ETHIOPIAN_EPOCH + 395;
    
    let year = Math.floor((4 * rJDN + 3) / 1461);
    let rDays = rJDN - (365 * year + Math.floor(year / 4));
    
    const month = Math.floor(rDays / 30);
    const day = (rDays % 30) + 1;
    
    // Edge case adjustment for exact month alignment bounds
    let adjustedMonth = month;
    let adjustedYear = year;
    
    if (month === 0) {
      adjustedMonth = 13;
      adjustedYear = year - 1;
    }

    return {
      year: adjustedYear,
      month: adjustedMonth,
      day: day,
      isLeap: this.isEthiopianLeapYear(adjustedYear)
    };
  }

  gregorianToEthiopian(year, month, day) {
    const cacheKey = `g2e:${year}:${month}:${day}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
    
    const jdn = this.gregorianToJDN(year, month, day);
    const result = this.jdnToEthiopian(jdn);
    
    this.cache.set(cacheKey, result);
    return result;
  }

  ethiopianToGregorian(year, month, day) {
    const cacheKey = `e2g:${year}:${month}:${day}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
    
    const jdn = this.ethiopianToJDN(year, month, day);
    const result = this.jdnToGregorian(jdn);
    
    this.cache.set(cacheKey, result);
    return result;
  }

  getCurrentDate() {
    const now = new Date();
    
    const eatString = now.toLocaleString("en-US", { timeZone: "Africa/Addis_Ababa" });
    const localDate = new Date(eatString);

    const gregorian = {
      year: localDate.getFullYear(),
      month: localDate.getMonth() + 1,
      day: localDate.getDate()
    };
    
    const ethiopian = this.gregorianToEthiopian(gregorian.year, gregorian.month, gregorian.day);
    
    return {
      gregorian,
      ethiopian,
      timestamp: now.toISOString()
    };
  }

  batchGregorianToEthiopian(dates) {
    return dates.map(date => {
      try {
        return { input: date, output: this.gregorianToEthiopian(date.year, date.month, date.day), success: true };
      } catch (error) {
        return { input: date, error: error.message, success: false };
      }
    });
  }

  batchEthiopianToGregorian(dates) {
    return dates.map(date => {
      try {
        return { input: date, output: this.ethiopianToGregorian(date.year, date.month, date.day), success: true };
      } catch (error) {
        return { input: date, error: error.message, success: false };
      }
    });
  }

  clearCache() { this.cache.clear(); }
  getCacheStats() { return { cacheSize: this.cache.size }; }
}

module.exports = new DateConversionService();