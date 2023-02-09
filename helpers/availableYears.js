const { LAST_AVAILABLE_YEAR, YEAR_SINCE } = require('../configs/global');

const availableYears = () => {
  const startYear = YEAR_SINCE;
  const endYear = LAST_AVAILABLE_YEAR;
  const years = [];

  for (let i = startYear; i <= endYear; i++) {
    years.push(i);
  }

  return years;
};

module.exports = {
  availableYears,
};
