const { createDateString } = require('../helpers/createDateString');

const h2023 = (year = 2023) => [
  createDateString(year, 1, 22, 'День защитника Отечества'),
  createDateString(year, 2, 7, 'Международный женский день'),
  createDateString(year, 10, 3, 'День народного единства'),
];

const h2024 = (year = 2024) => [
  createDateString(year, 1, 22, 'День защитника Отечества'),
  createDateString(year, 2, 7, 'Международный женский день'),
  createDateString(year, 4, 8, 'День Победы'),
  createDateString(year, 5, 11, 'День России'),
  createDateString(year, 11, 31, 'Новый год'),
];

module.exports = {
  h2023,
  h2024,
};
