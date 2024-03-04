const holidays = require('../data/holidays');
const shortDays = require('../data/shortDays');
const workingHolidays = require('../data/workingHolidays');

const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

const isWeekendWorking = (date) => {
  const day = date.getDay();
  return day === 6 && workingHolidays[`wh${date.getFullYear()}`]().some((e) => e.date === date.valueOf());
};

const isWorkingDay = (year, month, day) => {
  const date = new Date(Date.UTC(year, month - 1, day));
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  const isHoliday = holidays[`h${year}`]().some((e) => e.date === date.valueOf());
  const isShortDay = shortDays[`h${year}`]().some((e) => e.date === date.valueOf());

  const result = {
    year: Number(year),
    month: {
      name: monthName,
      id: month - 1,
    },
    date,
    isWorkingDay: !isHoliday && (isShortDay || (!isWeekend(date) || isWeekendWorking(date))),
  };

  if (isHoliday) {
    const holiday = holidays[`h${year}`]().find((el) => el.date === date.valueOf());
    result.holiday = holiday.name;
  }

  if (isShortDay) {
    const shortDay = shortDays[`h${year}`]().find((el) => el.date === date.valueOf());
    result.isShortDay = true;
    result.holiday = shortDay.name;
  }

  return result;
};

module.exports = {
  isWorkingDay,
};
