const holidays = require('../data/holidays');

const isWorkingDay = (year, month, day) => {
  if (month <= 0 || month > 12) return false;

  const correctMonth = month - 1;
  const date = new Date(year, correctMonth, day);

  // выходные дни: суббота и воскресенье
  if (date.getDay() === 6 || date.getDay() === 0) {
    return false;
  }

  // проверяем, есть ли дата в массиве праздничных дней
  return !holidays[`h${year}`]().some((holiday) => holiday.valueOf() === date.valueOf());
};

module.exports = {
  isWorkingDay,
};
