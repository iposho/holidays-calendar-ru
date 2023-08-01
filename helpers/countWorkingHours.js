const { countWorkingDays } = require('./countWorkingDays');
const { countShortDays } = require('./countShortDays');

const countWorkingHours = (year, month) => {
  const prevMonth = month - 1;
  const workingDays = countWorkingDays(year, prevMonth);
  const shortDays = countShortDays(year, prevMonth);

  return workingDays * 8 - shortDays;
};

module.exports = {
  countWorkingHours,
};
