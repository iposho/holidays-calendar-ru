const { countWorkingDays } = require('./countWorkingDays');

const generateMonths = (year) => {
  const months = [];
  for (let month = 0; month < 12; month++) {
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month, 1));
    const obj = {
      name: monthName,
      id: month,
      workingDays: countWorkingDays(year, month),
    };
    months.push(obj);
  }
  return months;
};

module.exports = {
  generateMonths,
};
