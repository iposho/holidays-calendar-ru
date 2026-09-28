/*
  Единственная реализация расчетов API производственного календаря.
  Используется генератором статического API (scripts/generate-static-api.js),
  хелперами src/helpers/* и валидацией запросов в src/proxy.ts.

  Требования импортируются статически, чтобы модуль собирался бандлером Next.js.
*/

const holidaysSource = require('../../src/data/holidays.json');
const shortDaysSource = require('../../src/data/shortDays.json');
const workingHolidaysSource = require('../../src/data/workingHolidays.json');
const transferredHolidaysSource = require('../../src/data/transferredHolidays.json');
const decreesSource = require('../../src/data/decrees.json');

const toIsoDate = (date) => date.toISOString().split('T')[0];

// Количество дней в месяце (month: 1-12)
const getDaysCount = (year, month) => new Date(Date.UTC(year, month, 0)).getUTCDate();

const isWeekend = (date) => {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

// ---- Годы: из ключей всех файлов данных ----
const years = [...new Set([
  ...Object.keys(holidaysSource),
  ...Object.keys(shortDaysSource),
  ...Object.keys(workingHolidaysSource),
  ...Object.keys(transferredHolidaysSource),
])]
  .map(Number)
  .filter(Number.isFinite)
  .sort((a, b) => a - b);

// ---- Нормализованные данные: { date: 'YYYY-MM-DD', name, from? } ----
const normalize = (source, year) => (source[String(year)] || []).map(({
  month, day, name, from,
}) => {
  const result = { date: toIsoDate(new Date(Date.UTC(year, month, day))), name };
  if (from) result.from = from;
  return result;
});

const EMPTY = {
  holidays: [], shortDays: [], workingHolidays: [], transferredHolidays: [],
};
const EMPTY_INDEX = {
  holidays: new Map(), shortDays: new Map(), workingHolidays: new Map(), transferredHolidays: new Map(),
};

const byYear = {};
const indexByYear = {};
years.forEach((year) => {
  const lists = {
    holidays: normalize(holidaysSource, year),
    shortDays: normalize(shortDaysSource, year),
    workingHolidays: normalize(workingHolidaysSource, year),
    transferredHolidays: normalize(transferredHolidaysSource, year),
  };
  byYear[year] = lists;
  // Индексы по дате вместо линейного поиска на каждый день года
  indexByYear[year] = Object.fromEntries(
    Object.entries(lists).map(([key, days]) => [key, new Map(days.map((d) => [d.date, d]))]),
  );
});

const getHolidays = (year) => (byYear[year] || EMPTY).holidays;
const getShortDays = (year) => (byYear[year] || EMPTY).shortDays;
const getWorkingHolidays = (year) => (byYear[year] || EMPTY).workingHolidays;
const getTransferredHolidays = (year) => (byYear[year] || EMPTY).transferredHolidays;
const getDecree = (year) => decreesSource[String(year)];

// Рабочий день: будний, не праздник и не перенесенный выходной — или выходной, ставший рабочим
const isWorkingDate = (date) => {
  const index = indexByYear[date.getUTCFullYear()] || EMPTY_INDEX;
  const iso = toIsoDate(date);
  if (isWeekend(date)) return index.workingHolidays.has(iso);
  return !index.holidays.has(iso) && !index.transferredHolidays.has(iso);
};

const isShortDate = (date) => (indexByYear[date.getUTCFullYear()] || EMPTY_INDEX).shortDays.has(toIsoDate(date));

// ---- Расчеты по месяцу (month: 0-11) ----
const countMonthDays = (year, month, predicate) => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));
  while (date.getUTCMonth() === month) {
    if (predicate(date)) count++;
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return count;
};

const countWorkingDays = (year, month) => countMonthDays(year, month, isWorkingDate);
const countShortDays = (year, month) => countMonthDays(year, month, isShortDate);

// month: 1-12
const countWorkingHours = (year, month) => (countWorkingDays(year, month - 1) * 8) - countShortDays(year, month - 1);

const monthNameFormat = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' });

// month: 1-12
const generateMonth = (year, month) => {
  const id = month - 1;
  const workingDays = countWorkingDays(year, id);
  const shortDays = countShortDays(year, id);
  return {
    id,
    name: monthNameFormat.format(new Date(Date.UTC(year, id, 1))),
    workingDays,
    notWorkingDays: getDaysCount(year, month) - workingDays,
    shortDays,
    workingHours: (workingDays * 8) - shortDays,
  };
};

const generateMonths = (year) => Array.from({ length: 12 }, (_, i) => generateMonth(year, i + 1));

// Информация о дне (month: 1-12)
const isWorkingDay = (year, month, day) => {
  const date = new Date(Date.UTC(year, month - 1, day));
  const iso = toIsoDate(date);
  const index = indexByYear[year] || EMPTY_INDEX;
  const holiday = index.holidays.get(iso);
  const transferredHoliday = index.transferredHolidays.get(iso);
  const shortDay = index.shortDays.get(iso);

  const result = {
    year: Number(year),
    month: { name: monthNameFormat.format(date), id: month - 1 },
    date,
    isWorkingDay: isWorkingDate(date),
  };
  if (holiday) result.holiday = holiday.name;
  if (transferredHoliday) {
    result.isTransferredHoliday = true;
    result.transferredHoliday = transferredHoliday.name;
  }
  if (shortDay) {
    result.isShortDay = true;
    result.holiday = shortDay.name;
  }
  return result;
};

module.exports = {
  years,
  getDaysCount,
  getHolidays,
  getShortDays,
  getWorkingHolidays,
  getTransferredHolidays,
  getDecree,
  countWorkingDays,
  countShortDays,
  countWorkingHours,
  generateMonth,
  generateMonths,
  isWorkingDay,
};
