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

  return {
    holidays: holidaysArray,
    shortDays: shortDaysArray,
  };
};

module.exports = {
  generateHolidays,
};
