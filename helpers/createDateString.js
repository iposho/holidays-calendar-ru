const createDateString = (year, month, date, name) => {
  const obj = { date: new Date(Date.UTC(year, month, date)).valueOf(), name };

  return obj;
};

module.exports = {
  createDateString,
};
