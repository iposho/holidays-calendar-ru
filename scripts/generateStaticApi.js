const fs = require('fs/promises');
const path = require('path');

const holidaysSource = require('../src/data/holidays.json');
const shortDaysSource = require('../src/data/shortDays.json');
const workingHolidaysSource = require('../src/data/workingHolidays.json');

const YEAR_SINCE = 2023;
const LAST_AVAILABLE_YEAR = 2025;

const processedHolidays = {};
const processedShortDays = {};
const processedWorkingHolidays = {};

for (let year = YEAR_SINCE; year <= LAST_AVAILABLE_YEAR; year++) {
  processedHolidays[year] = (holidaysSource[year] || []).map((d) =>
    createDateString(year, d.month, d.day, d.name)
  );
  processedShortDays[year] = (shortDaysSource[year] || []).map((d) =>
    createDateString(year, d.month, d.day, d.name)
  );
  processedWorkingHolidays[year] = (workingHolidaysSource[year] || []).map((d) =>
    createDateString(year, d.month, d.day, d.name)
  );
}

function createDateString(year, month, date, name) {
  return {
    date: new Date(Date.UTC(year, month, date)).toISOString().split('T')[0],
    name,
  };
}

function getHolidays(year) {
  return processedHolidays[year] || [];
}
function getShortDays(year) {
  return processedShortDays[year] || [];
}
function getWorkingHolidays(year) {
  return processedWorkingHolidays[year] || [];
}

function countWorkingDays(year, month) {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));
  const holidays = getHolidays(year);
  const workingHolidays = getWorkingHolidays(year);
  while (date.getUTCMonth() === month) {
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const isHoliday = holidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
    const isWorkingHoliday = workingHolidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
    if ((!isWeekend && !isHoliday) || (isWeekend && isWorkingHoliday)) {
      count++;
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return count;
}

function countShortDays(year, month) {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));
  const shortDays = getShortDays(year);
  while (date.getUTCMonth() === month) {
    if (shortDays.some((e) => new Date(e.date).valueOf() === date.valueOf())) {
      count++;
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return count;
}

function countWorkingHours(year, month) {
  const workingDays = countWorkingDays(year, month - 1);
  const shortDays = countShortDays(year, month - 1);
  return (workingDays * 8) - shortDays;
}

function generateMonths(year) {
  const months = [];
  for (let month = 0; month < 12; month++) {
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(Date.UTC(year, month, 1)));
    months.push({
      id: month,
      name: monthName,
      workingDays: countWorkingDays(year, month),
      notWorkingDays: getDaysCount(year, month + 1) - countWorkingDays(year, month),
      shortDays: countShortDays(year, month),
      workingHours: countWorkingHours(year, month + 1),
    });
  }
  return months;
}

function generateHolidays(year) {
  const holidays = getHolidays(year).map((i) => ({ date: i.date, name: i.name }));
  const shortDays = getShortDays(year).map((i) => ({ date: i.date, name: i.name }));
  return { holidays, shortDays };
}

function generateData() {
  const data = {};
  for (let year = YEAR_SINCE; year <= LAST_AVAILABLE_YEAR; year++) {
    data[year] = {
      months: generateMonths(year),
      holidays: generateHolidays(year),
    };
  }
  return data;
}

function getDaysCount(year, month) {
  return new Date(year, month, 0).getDate();
}

function isWorkingDayFn(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const holidays = getHolidays(year);
  const shortDays = getShortDays(year);
  const workingHolidays = getWorkingHolidays(year);
  const isHoliday = holidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
  const isShortDay = shortDays.some((e) => new Date(e.date).valueOf() === date.valueOf());
  const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
  const isWorkingHoliday = workingHolidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
  return {
    year,
    month: { name: monthName, id: month - 1 },
    date,
    isWorkingDay: !isHoliday && (!isWeekend || isWorkingHoliday),
    isShortDay: isShortDay || undefined,
    holiday: (isHoliday || isShortDay) ? (holidays.concat(shortDays).find((e) => new Date(e.date).valueOf() === date.valueOf())?.name) : undefined,
  };
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeJSON(file, data) {
  await ensureDir(path.dirname(file));
  await fs.writeFile(file, JSON.stringify(data));
}

async function main() {
  const data = generateData();
  const years = Object.keys(data).map(Number);
  const base = path.join(process.cwd(), 'public', 'static-api', 'calendar');
  await ensureDir(base);
  await writeJSON(path.join(base, 'index.json'), { years, status: 200 });
  for (const year of years) {
    const yearData = data[year];
    await writeJSON(path.join(base, `${year}.json`), { year, months: yearData.months, status: 200 });
    const holidays = yearData.holidays.holidays.map((h) => ({ date: new Date(h.date).toISOString(), name: h.name }));
    const shortDays = yearData.holidays.shortDays.map((s) => ({ date: new Date(s.date).toISOString(), name: s.name }));
    await writeJSON(path.join(base, `${year}`, 'holidays.json'), { year, holidays, shortDays, status: 200 });
    for (let month = 1; month <= 12; month++) {
      const monthData = yearData.months[month - 1];
      await writeJSON(path.join(base, `${year}`, `${month}.json`), { year, month: monthData, status: 200 });
      const days = getDaysCount(year, month);
      for (let day = 1; day <= days; day++) {
        const res = isWorkingDayFn(year, month, day);
        await writeJSON(path.join(base, `${year}`, `${month}`, `${day}.json`), {
          year,
          month: res.month,
          date: res.date.toISOString(),
          isWorkingDay: res.isWorkingDay,
          isShortDay: res.isShortDay,
          holiday: res.holiday,
          status: 200,
        });
      }
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
