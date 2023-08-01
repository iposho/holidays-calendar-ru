const holidays = require('../data/holidays');
const shortDays = require('../data/shortDays');

const isWorkingDay = (year, month, day) => {
  const correctMonth = month - 1;
  const date = new Date(Date.UTC(year, correctMonth, day));
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const isWeekend = date.getDay() === 6 || date.getDay() === 0;

  const holiday = holidays[`h${year}`]().find((el) => el.date === date.valueOf());
  const shortDay = shortDays[`h${year}`]().find((el) => el.date === date.valueOf());

  const result = {
    year: Number(year),
    month: {
      name: monthName,
      id: correctMonth,
    },
    date,
    isWorkingDay: !isWeekend && !holiday && !shortDay,
  };

  if (holiday) {
    result.holiday = holiday.name;
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
