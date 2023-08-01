const getDaysInMonth = (year, month) => {
  const lastDayOfCurrentMonth = new Date(year, month, 0);
  return lastDayOfCurrentMonth.getDate();
};

module.exports = {
  getDaysInMonth,
};
