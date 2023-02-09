const holidays = require('../data/holidays');
const { getDaysCount } = require('./getDaysCount');

const isWorkingDay = (year, month, day) => {
  if (month <= 0 || month > 12) return false;

  if (day < 1 || day > getDaysCount(year, month)) return { error: 'Invalid day' };

  const correctMonth = month - 1;
  const date = new Date(Date.UTC(year, correctMonth, day));

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  const condition = (date.getDay() === 6 || date.getDay() === 0)
    && !holidays[`h${year}`]().some((holiday) => holiday.valueOf() === date.valueOf());

  // проверяем, есть ли дата в массиве праздничных дней
  return {
    year: Number(year),
    month: monthName,
    date,
    isWorkingDay: condition,
  };
};

module.exports = {
  isWorkingDay,
};
