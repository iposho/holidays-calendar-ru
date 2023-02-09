const { countWorkingDays } = require('./countWorkingDays');
const { countShortDays } = require('./countShortDays');

const countWorkingHours = (year, month) => {
  const workingDays = countWorkingDays(year, month - 1);
  const shortDays = countShortDays(year, month - 1);

  return (workingDays * 8) - shortDays;
};

module.exports = {
  countWorkingHours,
};
