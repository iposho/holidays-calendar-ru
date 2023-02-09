const { countWorkingDays } = require('./countWorkingDays');
const { getDaysCount } = require('./getDaysCount');
const { countShortDays } = require('./countShortDays');
const { countWorkingHours } = require('./countWorkingHours');

const generateMonth = (year, month) => {
  const correctMonth = month - 1;
  const workingDays = countWorkingDays(year, correctMonth);

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, correctMonth, 1));

  const obj = {
    id: correctMonth,
    name: monthName,
    workingDays,
    notWorkingDays: getDaysCount(year, month) - workingDays,
    shortDays: countShortDays(year, correctMonth),
    workHours: countWorkingHours(year, month),
  };

  return obj;
};

module.exports = {
  generateMonth,
};
