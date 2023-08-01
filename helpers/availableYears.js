const { LAST_AVAILABLE_YEAR, YEAR_SINCE } = require('../configs/global');

const availableYears = () => {
  const startYear = YEAR_SINCE;
  const endYear = LAST_AVAILABLE_YEAR;

  // Use Array.from() to generate the array of years
  const years = Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index);

  return years;
};

module.exports = {
  availableYears,
};
