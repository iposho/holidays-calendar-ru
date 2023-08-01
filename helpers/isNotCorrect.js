const { LAST_AVAILABLE_YEAR, YEAR_SINCE } = require('../configs/global');
const { getTotalDaysInMonth } = require('./getTotalDaysInMonth');

const isNotCorrectYear = (year) => year < YEAR_SINCE || year > LAST_AVAILABLE_YEAR;
const isNotCorrectMonth = (month) => month < 1 || month > 12;
const isNotCorrectDay = (year, month, day) => {
  const totalDaysInMonth = getTotalDaysInMonth(year, month);
  return day < 1 || day > totalDaysInMonth;
};

module.exports = {
  isNotCorrectDay,
  isNotCorrectMonth,
  isNotCorrectYear,
};
