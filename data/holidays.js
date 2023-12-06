const { createDateString } = require('../helpers/createDateString');

const h2023 = (year = 2023) => [
  createDateString(year, 0, 1, 'Новый год'),
  createDateString(year, 0, 2, 'Новый год'),
  createDateString(year, 0, 3, 'Новый год'),
  createDateString(year, 0, 4, 'Новый год'),
  createDateString(year, 0, 5, 'Новый год'),
  createDateString(year, 0, 6, 'Новый год'),
  createDateString(year, 0, 7, 'Новый год'),
  createDateString(year, 0, 8, 'Новый год'),
  createDateString(year, 1, 23, 'День защитника Отечества'),
  createDateString(year, 1, 24, 'День защитника Отечества'),
  createDateString(year, 2, 8, 'Международный женский день'),
  createDateString(year, 4, 1, 'День Труда'),
  createDateString(year, 4, 8, 'День Победы'),
  createDateString(year, 4, 9, 'День Победы'),
  createDateString(year, 5, 12, 'День России'),
  createDateString(year, 10, 4, 'День народного единства'),
  createDateString(year, 10, 6, 'День народного единства'),
];

const h2024 = (year = 2024) => [
  createDateString(year, 0, 1, 'Новый год'),
  createDateString(year, 0, 2, 'Новый год'),
  createDateString(year, 0, 3, 'Новый год'),
  createDateString(year, 0, 4, 'Новый год'),
  createDateString(year, 0, 5, 'Новый год'),
  createDateString(year, 0, 6, 'Новый год'),
  createDateString(year, 0, 7, 'Новый год'),
  createDateString(year, 0, 8, 'Новый год'),
  createDateString(year, 1, 23, 'День защитника Отечества'),
  createDateString(year, 2, 8, 'Международный женский день'),
  createDateString(year, 3, 30, 'День Труда'),
  createDateString(year, 4, 1, 'День Труда'),
  createDateString(year, 4, 9, 'День Победы'),
  createDateString(year, 4, 10, 'День Победы'),
  createDateString(year, 5, 12, 'День России'),
  createDateString(year, 10, 3, 'День народного единства'),
  createDateString(year, 10, 4, 'День народного единства'),
  createDateString(year, 11, 30, 'Новый год'),
  createDateString(year, 11, 31, 'Новый год'),
];

module.exports = {
  h2023,
  h2024,
};
