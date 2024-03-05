const { createDateString } = require('../helpers/createDateString');

const wh2023 = () => [

];

const wh2024 = (year = 2024) => [
  createDateString(year, 10, 2, 'День народного единства'),
  createDateString(year, 11, 28, 'Новый год'),
];

module.exports = {
  wh2023,
  wh2024,
};
