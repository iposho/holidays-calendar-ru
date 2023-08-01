const { generateMonths } = require('./generateMonths');
const { generateMonth } = require('./generateMonth');
const { isWorkingDay } = require('./isWorkingDay');
const { isNotCorrectYear, isNotCorrectDay, isNotCorrectMonth } = require('./isNotCorrect');
const { getErrorMessages } = require('./getErrorMessages');
const { availableYears } = require('./availableYears');
const { createMainPage } = require('./createMainPage');
const { generateHolidays } = require('./generateHolidays');

module.exports = {
  generateMonths,
  generateMonth,
  isWorkingDay,
  isNotCorrectDay,
  isNotCorrectYear,
  isNotCorrectMonth,
  getErrorMessages,
  availableYears,
  createMainPage,
  generateHolidays,
}