// Ethiopian calendar constants (BATTLE-TESTED)
const ETHIOPIAN_EPOCH_JDN = 1724221; // JDN for Ethiopian date 0001-01-01
const ETHIOPIAN_LEAP_CYCLE = 4;
const ETHIOPIAN_DAYS_IN_MONTH = 30;
const ETHIOPIAN_MONTHS = 13;

// Ethiopian months names
const ETHIOPIAN_MONTHS_EN = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehasse', 'Pagume'
];

const ETHIOPIAN_MONTHS_AM = [
  'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'
];

// Weekdays
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_AM = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ'];

module.exports = {
  ETHIOPIAN_EPOCH_JDN,
  ETHIOPIAN_LEAP_CYCLE,
  ETHIOPIAN_DAYS_IN_MONTH,
  ETHIOPIAN_MONTHS,
  ETHIOPIAN_MONTHS_EN,
  ETHIOPIAN_MONTHS_AM,
  WEEKDAYS_EN,
  WEEKDAYS_AM
};