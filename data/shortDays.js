const { createDateString } = require('../helpers/createDateString');

const h2023 = (year = 2023) => [
  createDateString(year, 1, 22, 'День защитника Отечества'),
  createDateString(year, 2, 7, 'Международный женский день'),
  createDateString(year, 4, 1, 'День Труда'),
  createDateString(year, 4, 9, 'День Победы'),
  createDateString(year, 5, 12, 'День России'),
  createDateString(year, 10, 3, 'День народного единства'),
];

const h2024 = (year = 2024) => [
  createDateString(year, 0, 1, 'Новый год'),
  createDateString(year, 0, 2, 'Новый год'),
  createDateString(year, 0, 3, 'Новый год'),
  createDateString(year, 0, 4, 'Новый год'),
  createDateString(year, 0, 5, 'Новый год'),
  createDateString(year, 0, 6, 'Новый год'),
  createDateString(year, 0, 7, 'Новый год'),
  createDateString(year, 1, 23, 'День защитника Отечества'),
  createDateString(year, 2, 8, 'Международный женский день'),
  createDateString(year, 4, 1, 'День Труда'),
  createDateString(year, 4, 2, 'День Труда'),
  createDateString(year, 4, 3, 'День Труда'),
  createDateString(year, 4, 9, 'День Победы'),
  createDateString(year, 4, 10, 'День Победы'),
  createDateString(year, 5, 12, 'День России'),
  createDateString(year, 10, 4, 'День народного единства'),
];

module.exports = {
  h2023,
  h2024,
};
