const holidays = require('../data/holidays');

const countWorkingDays = (year, month) => {
  let count = 0;
  const date = new Date(year, month, 1);

  while (date.getMonth() === Number(month)) {
    if (date.getDay() > 0 && date.getDay() < 6 && !holidays[`h${year}`]().includes(date.valueOf())) {
      count++;
    }
    date.setDate(date.getDate() + 1);
  }
  return count;
};

module.exports = {
  countWorkingDays,
};
