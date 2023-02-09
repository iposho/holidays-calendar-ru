const { getDaysCount } = require('./getDaysCount');
const { LAST_AVAILABLE_YEAR, YEAR_SINCE } = require('../configs/global');

const isNotCorrectYear = (year) => year < YEAR_SINCE || year > LAST_AVAILABLE_YEAR;
const isNotCorrectMonth = (month) => month < 1 || month > 12;
const isNotCorrectDay = (year, month, day) => day < 1 || day > getDaysCount(year, month);

module.exports = {
  isNotCorrectDay,
  isNotCorrectMonth,
  isNotCorrectYear,
};
