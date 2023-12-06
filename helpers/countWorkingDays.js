const holidays = require('../data/holidays');
const workingHolidays = require('../data/workingHolidays');

const countWorkingDays = (year, month) => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));

  while (date.getMonth() === Number(month)) {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isHoliday = holidays[`h${year}`]().some((e) => e.date === date.valueOf());
    const isWorkingHoliday = workingHolidays[`wh${year}`]().some((e) => e.date === date.valueOf());

    if ((!isWeekend && !isHoliday) || (isWeekend && isWorkingHoliday)) {
      count++;
    }

    date.setDate(date.getDate() + 1);
  }
  return count;
};

module.exports = {
  countWorkingDays,
};
