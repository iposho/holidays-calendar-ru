const getDaysCount = (year, month) => new Date(year, month, 0).getDate();

module.exports = {
  getDaysCount,
};
