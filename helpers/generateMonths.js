const { countWorkingDays } = require('./countWorkingDays');
const { getDaysCount } = require('./getDaysCount');

const generateMonths = (year) => {
  const months = [];
  for (let month = 0; month < 12; month++) {
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month, 1));
    const workingDays = countWorkingDays(year, month);

    const obj = {
      id: month,
      name: monthName,
      workingDays,
      notWorkingDays: getDaysCount(year, month + 1) - workingDays,
    };
    months.push(obj);
  }
  return months;
};

module.exports = {
  generateMonths,
};
