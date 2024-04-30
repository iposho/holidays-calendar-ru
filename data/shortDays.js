const { createDateString } = require('../helpers/createDateString');

const sd2023 = (year = 2023) => [
  createDateString(year, 1, 22, 'День защитника Отечества'),
  createDateString(year, 2, 7, 'Международный женский день'),
  createDateString(year, 10, 3, 'День народного единства'),
];

const sd2024 = (year = 2024) => [
  createDateString(year, 1, 22, 'День защитника Отечества'),
  createDateString(year, 2, 7, 'Международный женский день'),
  createDateString(year, 4, 8, 'День Победы'),
  createDateString(year, 5, 11, 'День России'),
  createDateString(year, 10, 2, 'День народного единства'),
];

const sd2025 = (year = 2025) => [
  createDateString(year, 2, 7, 'Международный женский день'),
  createDateString(year, 3, 30, 'День Труда'),
  createDateString(year, 4, 8, 'День Победы'),
  createDateString(year, 5, 11, 'День России'),
  createDateString(year, 10, 3, 'День народного единства'),
  createDateString(year, 11, 31, 'День народного единства'),
];

module.exports = {
  sd2023,
  sd2024,
  sd2025,
};
