/*
  Общие константы и вспомогательные функции для работы с производственным календарём.
  Модуль не имеет зависимостей и используется скриптами обновления данных и тестами.
*/

const MONTHS_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const MONTHS_RU_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

// Нерабочие праздничные дни по ст. 112 ТК РФ (month: 0-11)
const STATUTORY_HOLIDAYS = [
  { month: 0, day: 1, name: 'Новогодние каникулы' },
  { month: 0, day: 2, name: 'Новогодние каникулы' },
  { month: 0, day: 3, name: 'Новогодние каникулы' },
  { month: 0, day: 4, name: 'Новогодние каникулы' },
  { month: 0, day: 5, name: 'Новогодние каникулы' },
  { month: 0, day: 6, name: 'Новогодние каникулы' },
  { month: 0, day: 7, name: 'Рождество Христово' },
  { month: 0, day: 8, name: 'Новогодние каникулы' },
  { month: 1, day: 23, name: 'День защитника Отечества' },
  { month: 2, day: 8, name: 'Международный женский день' },
  { month: 4, day: 1, name: 'Праздник Весны и Труда' },
  { month: 4, day: 9, name: 'День Победы' },
  { month: 5, day: 12, name: 'День России' },
  { month: 10, day: 4, name: 'День народного единства' },
];

const toIso = (year, month /* 0-11 */, day) => new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];

const parseIso = (iso) => {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month: month - 1, day };
};

const weekdayOf = (iso) => new Date(`${iso}T00:00:00Z`).getUTCDay();

const isWeekendIso = (iso) => {
  const wd = weekdayOf(iso);
  return wd === 0 || wd === 6;
};

// "2026-01-03" -> "3 января"
const humanDate = (iso) => {
  const { month, day } = parseIso(iso);
  return `${day} ${MONTHS_RU_GENITIVE[month]}`;
};

// Все даты года в формате ISO
const allDatesOfYear = (year) => {
  const dates = [];
  const date = new Date(Date.UTC(year, 0, 1));
  while (date.getUTCFullYear() === year) {
    dates.push(date.toISOString().split('T')[0]);
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return dates;
};

const statutoryHolidaysOf = (year) => STATUTORY_HOLIDAYS.map(({ month, day, name }) => ({
  date: toIso(year, month, day),
  name,
}));

module.exports = {
  MONTHS_RU,
  MONTHS_RU_GENITIVE,
  STATUTORY_HOLIDAYS,
  toIso,
  parseIso,
  weekdayOf,
  isWeekendIso,
  humanDate,
  allDatesOfYear,
  statutoryHolidaysOf,
};
