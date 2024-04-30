const createDateString = (year, month, date, name) => ({
  date: new Date(Date.UTC(year, month, date)).valueOf(),
  name,
});

module.exports = {
  createDateString,
};
