const holidays = require('../data/holidays');
const shortDays = require('../data/shortDays');
const workingHolidays = require('../data/workingHolidays');

const isWorkingDay = (year, month, day) => {
  const correctMonth = month - 1;
  const date = new Date(Date.UTC(year, correctMonth, day));

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  const obj = holidays[`h${year}`]().find((el) => el.date === date.valueOf());

  const shortDay = shortDays[`h${year}`]().find((el) => el.date === date.valueOf());

  const condition = !(date.getDay() === 6 || date.getDay() === 0)
    && (
      !holidays[`h${year}`]().some((e) => e.date === date.valueOf()) ||
      workingHolidays[`wh${year}`]().some((e) => e.date === date.valueOf())
    )

  const result = {
    year: Number(year),
    month: {
      name: monthName,
      id: correctMonth,
    },
    date,
    isWorkingDay: condition,
  };

  if (obj) {
    result.holiday = obj.name;
  }

  if (shortDay) {
    result.isShortday = true;
    result.holiday = shortDay.name;
  }

  return result;
};

module.exports = {
  isWorkingDay,
};
