const holidays = require('../data/holidays');
const shortDays = require('../data/shortDays');

const generateHolidays = (year) => {
  const holidaysArray = holidays[`h${year}`]().map((i) => ({
    date: new Date(i.date),
    name: i.name,
  }));
  const shortDaysArray = shortDays[`h${year}`]().map((i) => ({
    date: new Date(i.date),
    name: i.name,
  }));

  const result = {
    holidays: holidaysArray,
    shortDays: shortDaysArray,
  };

  return result;
};

module.exports = {
  generateHolidays,
};
