const shortDays = require('../data/shortDays');

const countShortDays = (year, month) => {
  const shortDaysOfYearMonth = shortDays[`h${year}`]();
  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 0));
  let count = 0;

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    if (shortDaysOfYearMonth.some((shortDay) => shortDay.date === date.valueOf())) {
      count++;
    }
  }

  return count;
};

module.exports = {
  countShortDays,
};