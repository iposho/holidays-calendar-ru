const { countWorkingDays } = require('./countWorkingDays');
const { getDaysCount } = require('./getDaysCount');

const generateMonth = (year, month) => {
  const correctMonth = month - 1;
  const workingDays = countWorkingDays(year, correctMonth);

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, correctMonth, 1));
  const obj = {
    name: monthName,
    id: correctMonth,
    workingDays,
    notWorkingDays: getDaysCount(year, month) - workingDays,
  };

  return obj;
};

module.exports = {
  generateMonth,
};
