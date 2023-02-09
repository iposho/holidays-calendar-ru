const holidays = require('../data/holidays');

const isWorkingDay = (year, month, day) => {
  const correctMonth = month - 1;
  const date = new Date(Date.UTC(year, correctMonth, day));

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  const condition = !(date.getDay() === 6 || date.getDay() === 0)
    && !holidays[`h${year}`]().some((holiday) => holiday.valueOf() === date.valueOf());

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
