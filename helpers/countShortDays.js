const shortDays = require('../data/shortDays');

const countShortDays = (year, month) => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));

  while (date.getMonth() === Number(month)) {
    if (shortDays[`h${year}`]().some((e) => e.date === date.valueOf())) {
      count++;
    }
    date.setDate(date.getDate() + 1);
  }
  return count;
};

module.exports = {
  countShortDays,
};
