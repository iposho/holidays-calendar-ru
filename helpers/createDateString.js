const createDateString = (year, month, date, name) => {
  const dateObj = {
    date: new Date(Date.UTC(year, month, date)).valueOf(),
    name,
  };

  return dateObj;
};

module.exports = {
  createDateString,
};