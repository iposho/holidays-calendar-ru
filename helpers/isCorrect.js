const { getDaysCount } = require('./getDaysCount');
const { LAST_AVAILABLE_YEAR, YEAR_SINCE } = require('../configs/global');

const isCorrectYear = (year) => year < YEAR_SINCE || year > LAST_AVAILABLE_YEAR;
const isCorrectMonth = (month) => month < 1 || month > 12;
const isCorrectDay = (year, month, day) => day < 1 || day > getDaysCount(year, month);

module.exports = {
  isCorrectDay,
  isCorrectMonth,
  isCorrectYear,
};
