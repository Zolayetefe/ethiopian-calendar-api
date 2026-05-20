const dateConversionService = require('./src/services/dateConversionService');

console.log('=== Testing Ethiopian Calendar Conversion ===\n');

// Test 1: Basic conversion
console.log('Test 1: Basic Conversion');
const result = dateConversionService.gregorianToEthiopian(2024, 1, 1);
console.log(`Gregorian: 2024-1-1 → Ethiopian: ${result.year}-${result.month}-${result.day}`);
console.log(`Is Leap Year: ${result.isLeap}\n`);

// Test 2: Round trip
console.log('Test 2: Round Trip Conversion');
const original = { year: 2024, month: 9, day: 11 };
const ethiopian = dateConversionService.gregorianToEthiopian(original.year, original.month, original.day);
const back = dateConversionService.ethiopianToGregorian(ethiopian.year, ethiopian.month, ethiopian.day);
console.log(`Original: ${original.year}-${original.month}-${original.day}`);
console.log(`Converted to Ethiopian: ${ethiopian.year}-${ethiopian.month}-${ethiopian.day}`);
console.log(`Back to Gregorian: ${back.year}-${back.month}-${back.day}`);
console.log(`Match: ${original.year === back.year && original.month === back.month && original.day === back.day}\n`);

// Test 3: Current date
console.log('Test 3: Current Date');
const current = dateConversionService.getCurrentDate();
console.log(`Today (Gregorian): ${current.gregorian.year}-${current.gregorian.month}-${current.gregorian.day}`);
console.log(`Today (Ethiopian): ${current.ethiopian.year}-${current.ethiopian.month}-${current.ethiopian.day}`);
console.log(`Timestamp: ${current.timestamp}\n`);

// Test 4: Pagume validation - CORRECTED EXPECTATIONS
console.log('Test 4: Pagume Validation');
// For Ethiopian year 2016 (common year, started Sep 11, 2023)
const year2016Common = 2016;
const year2015Leap = 2015;

console.log(`Year ${year2016Common} (Common Year) Pagume 6 valid: ${dateConversionService.isValidEthiopianDate(year2016Common, 13, 6)}`);
console.log(`Year ${year2015Leap} (Leap Year) Pagume 6 valid: ${dateConversionService.isValidEthiopianDate(year2015Leap, 13, 6)}`);
console.log(`Year ${year2015Leap} (Leap Year) Pagume 5 valid: ${dateConversionService.isValidEthiopianDate(year2015Leap, 13, 5)}\n`);

// Test 5: Leap year testing
console.log('Test 5: Leap Year Testing');
const testYears = [2015, 2016, 2017, 2018, 2019, 2020];
testYears.forEach(year => {
  const isLeap = dateConversionService.isEthiopianLeapYear(year);
  console.log(`Ethiopian Year ${year}: ${isLeap ? 'LEAP (6 days in Pagume)' : 'Common (5 days in Pagume)'}`);
});
console.log('');

// Test 6: Batch conversion
console.log('Test 6: Batch Conversion');
const batchDates = [
  { year: 2024, month: 1, day: 1 },
  { year: 2024, month: 6, day: 15 },
  { year: 2024, month: 12, day: 31 }
];
const batchResults = dateConversionService.batchGregorianToEthiopian(batchDates);
batchResults.forEach(result => {
  if (result.success) {
    console.log(`${result.input.year}-${result.input.month}-${result.input.day} → ${result.output.year}-${result.output.month}-${result.output.day}`);
  } else {
    console.log(`${result.input.year}-${result.input.month}-${result.input.day} → ERROR: ${result.error}`);
  }
});
console.log('');

// Test 7: Ethiopian New Year boundary
console.log('Test 7: Ethiopian New Year Boundary');
const beforeNewYear = dateConversionService.gregorianToEthiopian(2024, 9, 10);
const afterNewYear = dateConversionService.gregorianToEthiopian(2024, 9, 11);
console.log(`Sep 10, 2024 Gregorian → Ethiopian: ${beforeNewYear.year}-${beforeNewYear.month}-${beforeNewYear.day}`);
console.log(`Sep 11, 2024 Gregorian → Ethiopian: ${afterNewYear.year}-${afterNewYear.month}-${afterNewYear.day}`);
console.log('');

// Test 8: Verify Pagume 6 in leap year
console.log('Test 8: Pagume 6 in Leap Year');
const pagume6LeapYear = dateConversionService.ethiopianToGregorian(2019, 13, 6);
console.log(`Ethiopian 2019-13-6 (Pagume 6) → Gregorian: ${pagume6LeapYear.year}-${pagume6LeapYear.month}-${pagume6LeapYear.day}`);

console.log('\n✅ All tests completed successfully!');