const holidays = require('../data/holidays');

const countWorkingDays = (year, month) => {
  const holidaysOfYearMonth = holidays[`h${year}`]();
  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 0));
  let count = 0;

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    if (date.getDay() > 0 && date.getDay() < 6 && !holidaysOfYearMonth.some((holiday) => holiday.date === date.valueOf())) {
      count++;
    }
  }

  return count;
};

module.exports = {
  countWorkingDays,
};
