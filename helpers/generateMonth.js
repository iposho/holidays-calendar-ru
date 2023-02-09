const { countWorkingDays } = require('./countWorkingDays');

const generateMonth = (year, month) => {
  if (month <= 0 || month > 12) return false;

  const correctMonth = month - 1;

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, correctMonth, 1));
  const obj = {
    name: monthName,
    workingDays: countWorkingDays(year, correctMonth),
  };

  return obj;
};

module.exports = {
  generateMonth,
};
