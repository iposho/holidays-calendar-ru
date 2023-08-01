const { countWorkingDays } = require('./countWorkingDays');
const { getTotalDaysInMonth } = require('./getTotalDaysInMonth');
const { countShortDays } = require('./countShortDays');
const { countWorkingHours } = require('./countWorkingHours');

const generateMonth = (year, month) => {
  const correctMonth = month - 1;
  const workingDays = countWorkingDays(year, correctMonth);
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, correctMonth, 1));
  const notWorkingDays = getTotalDaysInMonth(year, month) - workingDays;

  return {
    id: correctMonth,
    name: monthName,
    workingDays,
    notWorkingDays,
    shortDays: countShortDays(year, correctMonth),
    workingHours: countWorkingHours(year, month),
  };
};

module.exports = {
  generateMonth,
};