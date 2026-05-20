const dateConversionService = require('../src/services/dateConversionService');

describe('Ethiopian Calendar Conversion Service - Battle Tests', () => {
  
  describe('Leap Year Calculations', () => {
    test('Correctly identifies Ethiopian leap years', () => {
      // Ethiopian leap years: 1, 5, 9, 13, 17, 21...
      const leapYears = [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45, 49];
      const nonLeapYears = [2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 16];
      
      leapYears.forEach(year => {
        expect(dateConversionService.isEthiopianLeapYear(year)).toBe(true);
      });
      
      nonLeapYears.forEach(year => {
        expect(dateConversionService.isEthiopianLeapYear(year)).toBe(false);
      });
    });
    
    test('Handles edge cases for leap years', () => {
      expect(dateConversionService.isEthiopianLeapYear(0)).toBe(false);
      expect(dateConversionService.isEthiopianLeapYear(-1)).toBe(false);
      expect(dateConversionService.isEthiopianLeapYear(null)).toBe(false);
      expect(dateConversionService.isEthiopianLeapYear(undefined)).toBe(false);
    });
  });
  
  describe('Month Days Calculation', () => {
    test('First 12 months have 30 days', () => {
      const year = 2016; // Leap year
      for (let month = 1; month <= 12; month++) {
        expect(dateConversionService.getEthiopianMonthDays(year, month)).toBe(30);
      }
    });
    
    test('Pagume (13th month) has correct days', () => {
      // Non-leap year
      expect(dateConversionService.getEthiopianMonthDays(2015, 13)).toBe(5);
      
      // Leap year
      expect(dateConversionService.getEthiopianMonthDays(2016, 13)).toBe(6);
    });
    
    test('Throws error for invalid months', () => {
      expect(() => dateConversionService.getEthiopianMonthDays(2016, 0)).toThrow();
      expect(() => dateConversionService.getEthiopianMonthDays(2016, 14)).toThrow();
      expect(() => dateConversionService.getEthiopianMonthDays(2016, 'invalid')).toThrow();
    });
  });
  
  describe('Gregorian to Ethiopian Conversion', () => {
    // Known good conversions from reliable sources
    const testCases = [
      { gregorian: { year: 2024, month: 1, day: 1 }, expected: { year: 2016, month: 4, day: 22 } },
      { gregorian: { year: 2024, month: 9, day: 11 }, expected: { year: 2016, month: 13, day: 5 } },
      { gregorian: { year: 2024, month: 9, day: 12 }, expected: { year: 2017, month: 1, day: 1 } },
      { gregorian: { year: 2023, month: 9, day: 11 }, expected: { year: 2015, month: 13, day: 5 } },
      { gregorian: { year: 2020, month: 1, day: 1 }, expected: { year: 2012, month: 4, day: 22 } },
    ];
    
    testCases.forEach(({ gregorian, expected }) => {
      test(`Convert ${gregorian.year}-${gregorian.month}-${gregorian.day} to Ethiopian`, () => {
        const result = dateConversionService.gregorianToEthiopian(
          gregorian.year,
          gregorian.month,
          gregorian.day
        );
        
        expect(result.year).toBe(expected.year);
        expect(result.month).toBe(expected.month);
        expect(result.day).toBe(expected.day);
      });
    });
    
    test('Handles New Year boundary correctly', () => {
      // Ethiopian New Year is September 11 (or 12 in leap years)
      const result = dateConversionService.gregorianToEthiopian(2024, 9, 11);
      expect(result.year).toBe(2016);
      expect(result.month).toBe(13);
      expect(result.day).toBe(5);
      
      const resultNextDay = dateConversionService.gregorianToEthiopian(2024, 9, 12);
      expect(resultNextDay.year).toBe(2017);
      expect(resultNextDay.month).toBe(1);
      expect(resultNextDay.day).toBe(1);
    });
  });
  
  describe('Ethiopian to Gregorian Conversion', () => {
    // Reverse of previous test cases
    const testCases = [
      { ethiopian: { year: 2016, month: 4, day: 22 }, expected: { year: 2024, month: 1, day: 1 } },
      { ethiopian: { year: 2016, month: 13, day: 5 }, expected: { year: 2024, month: 9, day: 11 } },
      { ethiopian: { year: 2017, month: 1, day: 1 }, expected: { year: 2024, month: 9, day: 12 } },
      { ethiopian: { year: 2015, month: 13, day: 5 }, expected: { year: 2023, month: 9, day: 11 } },
    ];
    
    testCases.forEach(({ ethiopian, expected }) => {
      test(`Convert ${ethiopian.year}-${ethiopian.month}-${ethiopian.day} to Gregorian`, () => {
        const result = dateConversionService.ethiopianToGregorian(
          ethiopian.year,
          ethiopian.month,
          ethiopian.day
        );
        
        expect(result.year).toBe(expected.year);
        expect(result.month).toBe(expected.month);
        expect(result.day).toBe(expected.day);
      });
    });
  });
  
  describe('Round-trip Conversion Accuracy', () => {
    test('Gregorian → Ethiopian → Gregorian returns original date', () => {
      const testDates = [
        { year: 2024, month: 1, day: 1 },
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 12, day: 31 },
        { year: 2023, month: 2, day: 28 },
        { year: 2020, month: 2, day: 29 }, // Leap day
        { year: 2021, month: 9, day: 11 },
        { year: 2022, month: 9, day: 12 },
      ];
      
      testDates.forEach(original => {
        const ethiopian = dateConversionService.gregorianToEthiopian(
          original.year, original.month, original.day
        );
        const result = dateConversionService.ethiopianToGregorian(
          ethiopian.year, ethiopian.month, ethiopian.day
        );
        
        expect(result.year).toBe(original.year);
        expect(result.month).toBe(original.month);
        expect(result.day).toBe(original.day);
      });
    });
    
    test('Ethiopian → Gregorian → Ethiopian returns original date', () => {
      const testDates = [
        { year: 2016, month: 1, day: 1 },
        { year: 2016, month: 6, day: 15 },
        { year: 2016, month: 13, day: 5 },
        { year: 2015, month: 13, day: 6 }, // Pagume 6 doesn't exist in 2015
        { year: 2017, month: 1, day: 1 },
        { year: 2020, month: 4, day: 22 },
      ];
      
      testDates.forEach(original => {
        // Skip invalid Pagume dates
        if (original.month === 13 && original.day === 6) {
          if (!dateConversionService.isEthiopianLeapYear(original.year)) {
            return;
          }
        }
        
        const gregorian = dateConversionService.ethiopianToGregorian(
          original.year, original.month, original.day
        );
        const result = dateConversionService.gregorianToEthiopian(
          gregorian.year, gregorian.month, gregorian.day
        );
        
        expect(result.year).toBe(original.year);
        expect(result.month).toBe(original.month);
        expect(result.day).toBe(original.day);
      });
    });
  });
  
  describe('Edge Cases and Error Handling', () => {
    test('Rejects invalid Gregorian dates', () => {
      const invalidDates = [
        { year: 2024, month: 2, day: 30 }, // Invalid day
        { year: 2024, month: 13, day: 1 }, // Invalid month
        { year: 2024, month: 0, day: 1 },  // Invalid month
        { year: 0, month: 1, day: 1 },     // Year too low
        { year: 10000, month: 1, day: 1 }, // Year too high
      ];
      
      invalidDates.forEach(date => {
        expect(() => {
          dateConversionService.gregorianToEthiopian(date.year, date.month, date.day);
        }).toThrow();
      });
    });
    
    test('Rejects invalid Ethiopian dates', () => {
      const invalidDates = [
        { year: 2016, month: 13, day: 7 }, // Pagume 7 doesn't exist
        { year: 2015, month: 13, day: 6 }, // Pagume 6 doesn't exist in non-leap year
        { year: 2016, month: 14, day: 1 }, // Invalid month
        { year: 2016, month: 0, day: 1 },  // Invalid month
        { year: 0, month: 1, day: 1 },     // Year too low
      ];
      
      invalidDates.forEach(date => {
        expect(() => {
          dateConversionService.ethiopianToGregorian(date.year, date.month, date.day);
        }).toThrow();
      });
    });
    
    test('Handles Pagume edge cases correctly', () => {
      // Leap year - Pagume 6 should be valid
      const leapYearResult = dateConversionService.ethiopianToGregorian(2016, 13, 6);
      expect(leapYearResult).toBeDefined();
      
      // Non-leap year - Pagume 6 should be invalid
      expect(() => {
        dateConversionService.ethiopianToGregorian(2015, 13, 6);
      }).toThrow();
      
      // Pagume 5 should be valid in both leap and non-leap years
      const nonLeapResult = dateConversionService.ethiopianToGregorian(2015, 13, 5);
      expect(nonLeapResult).toBeDefined();
    });
  });
  
  describe('Performance and Caching', () => {
    test('Caching improves performance', () => {
      dateConversionService.clearCache();
      
      const startNoCache = Date.now();
      for (let i = 0; i < 100; i++) {
        dateConversionService.gregorianToEthiopian(2024, 1, 1);
      }
      const durationNoCache = Date.now() - startNoCache;
      
      const startWithCache = Date.now();
      for (let i = 0; i < 100; i++) {
        dateConversionService.gregorianToEthiopian(2024, 1, 1);
      }
      const durationWithCache = Date.now() - startWithCache;
      
      // With cache should be faster
      expect(durationWithCache).toBeLessThan(durationNoCache);
    });
    
    test('Cache statistics are accurate', () => {
      dateConversionService.clearCache();
      expect(dateConversionService.getCacheStats().totalCacheSize).toBe(0);
      
      dateConversionService.gregorianToEthiopian(2024, 1, 1);
      expect(dateConversionService.getCacheStats().totalCacheSize).toBeGreaterThan(0);
    });
  });
  
  describe('Batch Conversion', () => {
    test('Batch Gregorian to Ethiopian handles multiple dates', () => {
      const dates = [
        { year: 2024, month: 1, day: 1 },
        { year: 2024, month: 6, day: 15 },
        { year: 2024, month: 12, day: 31 },
        { year: 2024, month: 13, day: 1 }, // Invalid
      ];
      
      const results = dateConversionService.batchGregorianToEthiopian(dates);
      
      expect(results).toHaveLength(4);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[2].success).toBe(true);
      expect(results[3].success).toBe(false);
    });
    
    test('Batch Ethiopian to Gregorian handles multiple dates', () => {
      const dates = [
        { year: 2016, month: 1, day: 1 },
        { year: 2016, month: 6, day: 15 },
        { year: 2016, month: 13, day: 6 },
        { year: 2015, month: 13, day: 6 }, // Invalid
      ];
      
      const results = dateConversionService.batchEthiopianToGregorian(dates);
      
      expect(results).toHaveLength(4);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(true);
      expect(results[2].success).toBe(true);
      expect(results[3].success).toBe(false);
    });
  });
  
  describe('Current Date', () => {
    test('Returns valid current date', () => {
      const currentDate = dateConversionService.getCurrentDate();
      
      expect(currentDate).toHaveProperty('gregorian');
      expect(currentDate).toHaveProperty('ethiopian');
      expect(currentDate).toHaveProperty('timestamp');
      expect(currentDate.gregorian.year).toBeGreaterThan(2000);
      expect(currentDate.ethiopian.year).toBeGreaterThan(2000);
    });
    
    test('Current date conversion is consistent', () => {
      const currentDate = dateConversionService.getCurrentDate();
      
      // Convert Gregorian to Ethiopian should match
      const converted = dateConversionService.gregorianToEthiopian(
        currentDate.gregorian.year,
        currentDate.gregorian.month,
        currentDate.gregorian.day
      );
      
      expect(converted.year).toBe(currentDate.ethiopian.year);
      expect(converted.month).toBe(currentDate.ethiopian.month);
      expect(converted.day).toBe(currentDate.ethiopian.day);
    });
  });
});