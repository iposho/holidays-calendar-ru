/*
  Построение данных календаря (src/data/*.json) на основе «снимка» производственного календаря
  (списка нерабочих и предпраздничных дней, например, с consultant.ru) и переносов из постановления
  Правительства РФ.

  Результат для каждого года:
  - holidays            — нерабочие праздничные дни по ст. 112 ТК РФ (в том числе выпавшие на выходные);
  - transferredHolidays — дополнительные выходные, появившиеся из-за переноса (постановлением Правительства
                          или автоматически по ч. 2 ст. 112 ТК РФ, если праздник совпал с выходным);
  - workingHolidays     — выходные дни (сб/вс), которые стали рабочими из-за переноса;
  - shortDays           — предпраздничные дни, сокращённые на 1 час.
*/

const {
  parseIso,
  isWeekendIso,
  humanDate,
  allDatesOfYear,
  statutoryHolidaysOf,
} = require('./core');

const addDays = (iso, days) => {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split('T')[0];
};

const toDayData = (iso, name, extra = {}) => {
  const { month, day } = parseIso(iso);
  return {
    month, day, name, ...extra,
  };
};

const byDate = (a, b) => (a.month - b.month) || (a.day - b.day);

/**
 * @param {{ year: number, nonWorkingDays: string[], shortDays: string[] }} snapshot
 * @param {{ transfers?: { from: string, to: string }[] }} [decree]
 */
const buildYearData = (snapshot, decree = {}) => {
  const { year } = snapshot;
  const transfers = decree.transfers || [];
  const nonWorking = new Set(snapshot.nonWorkingDays);
  const yearDates = allDatesOfYear(year);

  snapshot.nonWorkingDays.concat(snapshot.shortDays).forEach((iso) => {
    if (parseIso(iso).year !== year) throw new Error(`${year}: дата ${iso} не относится к году`);
  });

  const holidays = statutoryHolidaysOf(year);
  const holidayByDate = new Map(holidays.map((h) => [h.date, h]));

  holidays.forEach((h) => {
    if (!nonWorking.has(h.date)) {
      throw new Error(`${year}: праздник ${h.date} (${h.name}) отмечен в источнике как рабочий день`);
    }
  });

  transfers.forEach(({ from, to }) => {
    if (!isWeekendIso(from)) throw new Error(`${year}: перенос с ${from} — это не выходной день`);
    if (isWeekendIso(to)) throw new Error(`${year}: перенос на ${to} — это уже выходной день`);
    if (!nonWorking.has(to)) throw new Error(`${year}: перенос на ${to}, но в источнике это рабочий день`);
    if (!holidayByDate.has(from) && nonWorking.has(from)) {
      throw new Error(`${year}: выходной ${from} перенесен, но в источнике он остается нерабочим`);
    }
  });

  // Будни, которые являются нерабочими, но не являются праздниками — это перенесенные выходные
  const transferredCandidates = new Set(
    yearDates.filter((iso) => nonWorking.has(iso) && !isWeekendIso(iso) && !holidayByDate.has(iso)),
  );

  const transferredFrom = new Map(); // to -> from
  transfers.forEach(({ from, to }) => transferredFrom.set(to, from));

  // Автоматический перенос по ч. 2 ст. 112 ТК РФ: праздник (кроме январских), совпавший с выходным,
  // переносится на следующий после него рабочий день
  const decreeSources = new Set(transfers.map((t) => t.from));
  holidays
    .filter((h) => parseIso(h.date).month !== 0 && isWeekendIso(h.date) && !decreeSources.has(h.date))
    .forEach((h) => {
      let candidate = addDays(h.date, 1);
      while (
        parseIso(candidate).year === year
        && (isWeekendIso(candidate) || holidayByDate.has(candidate) || transferredFrom.has(candidate))
      ) {
        candidate = addDays(candidate, 1);
      }
      if (!transferredCandidates.has(candidate)) {
        throw new Error(`${year}: праздник ${h.date} выпал на выходной, но ${candidate} в источнике рабочий день`);
      }
      transferredFrom.set(candidate, h.date);
    });

  const unexplained = [...transferredCandidates].filter((iso) => !transferredFrom.has(iso));
  if (unexplained.length) {
    throw new Error(`${year}: нерабочие дни без объяснения (добавьте перенос в decrees.json): ${unexplained.join(', ')}`);
  }

  const transferredHolidays = [...transferredFrom.entries()]
    .map(([to, from]) => toDayData(to, `Перенесенный выходной с ${humanDate(from)}`, { from }))
    .sort(byDate);

  const transferByFrom = new Map(transfers.map((t) => [t.from, t.to]));
  const workingHolidays = yearDates
    .filter((iso) => isWeekendIso(iso) && !nonWorking.has(iso))
    .map((iso) => {
      const to = transferByFrom.get(iso);
      const name = to ? `Рабочий день (выходной перенесен на ${humanDate(to)})` : 'Рабочий выходной день';
      return toDayData(iso, name);
    });

  const shortDays = [...snapshot.shortDays].sort().map((iso) => {
    if (nonWorking.has(iso)) throw new Error(`${year}: сокращенный день ${iso} отмечен как нерабочий`);
    const nextHoliday = holidays.find((h) => h.date > iso);
    return toDayData(iso, nextHoliday ? nextHoliday.name : 'Новогодние каникулы');
  });

  return {
    holidays: holidays.map((h) => toDayData(h.date, h.name)),
    transferredHolidays,
    workingHolidays,
    shortDays,
  };
};

module.exports = { buildYearData };
