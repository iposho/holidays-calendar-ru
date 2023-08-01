const holidays = require('../data/holidays');
const shortDays = require('../data/shortDays');

const generateHolidays = (year) => {
  const convertToDateObjects = (array) =>
    array[`h${year}`]().map((item) => ({ date: new Date(item.date), name: item.name }));

  const holidaysArray = convertToDateObjects(holidays);
  const shortDaysArray = convertToDateObjects(shortDays);

  return {
    holidays: holidaysArray,
    shortDays: shortDaysArray,
  };
};

module.exports = {
  generateHolidays,
};
