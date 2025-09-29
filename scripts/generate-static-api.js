/*
  Generates a fully static version of the API under public/static-api.
  It mirrors the responses of existing /api/calendar routes as JSON files.
*/

const fs = require('fs');
const path = require('path');

// ---- Load source JSON data ----
const holidaysSource = require(path.join(process.cwd(), 'src', 'data', 'holidays.json'));
const shortDaysSource = require(path.join(process.cwd(), 'src', 'data', 'shortDays.json'));
const workingHolidaysSource = require(path.join(process.cwd(), 'src', 'data', 'workingHolidays.json'));

// ---- Utils ----
const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const writeJSON = (filePath, obj) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(obj), 'utf8');
};

const getDaysCount = (year, month /* 1-12 */) => new Date(year, month, 0).getDate();

const createDateString = (year, month /* 0-11 */, date, name) => ({
  date: new Date(Date.UTC(year, month, date)).toISOString().split('T')[0],
  name,
});

// ---- Build available years from data keys ----
const yearsSet = new Set([
  ...Object.keys(holidaysSource || {}),
  ...Object.keys(shortDaysSource || {}),
  ...Object.keys(workingHolidaysSource || {}),
]);
const years = Array.from(yearsSet)
  .map((y) => Number(y))
  .filter((y) => Number.isFinite(y))
  .sort((a, b) => a - b);

// ---- Preprocess data to normalized structures ----
const processedHolidays = {};
const processedShortDays = {};
const processedWorkingHolidays = {};

for (const year of years) {
  const holidays = (holidaysSource[String(year)] || []).map(({ month, day, name }) => createDateString(year, month, day, name));
  const shortDays = (shortDaysSource[String(year)] || []).map(({ month, day, name }) => createDateString(year, month, day, name));
  const workingHolidays = (workingHolidaysSource[String(year)] || []).map(({ month, day, name }) => createDateString(year, month, day, name));
  processedHolidays[year] = holidays;
  processedShortDays[year] = shortDays;
  processedWorkingHolidays[year] = workingHolidays;
}

const getHolidays = (year) => processedHolidays[year] || [];
const getShortDays = (year) => processedShortDays[year] || [];
const getWorkingHolidays = (year) => processedWorkingHolidays[year] || [];

// ---- Calculations ----
const countWorkingDays = (year, month /* 0-11 */) => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));
  const holidays = getHolidays(year);
  const workingHolidays = getWorkingHolidays(year);

  while (date.getUTCMonth() === month) {
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const isHoliday = holidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
    const isWorkingHoliday = workingHolidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
    if ((!isWeekend && !isHoliday) || (isWeekend && isWorkingHoliday)) count++;
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return count;
};

const countShortDays = (year, month /* 0-11 */) => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));
  const shortDays = getShortDays(year);
  while (date.getUTCMonth() === month) {
    if (shortDays.some((e) => new Date(e.date).valueOf() === date.valueOf())) count++;
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return count;
};

const countWorkingHours = (year, month /* 1-12 */) => (countWorkingDays(year, month - 1) * 8) - countShortDays(year, month - 1);

const generateMonth = (year, month /* 1-12 */) => {
  const correctMonth = month - 1;
  const workingDays = countWorkingDays(year, correctMonth);
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, correctMonth, 1));
  return {
    id: correctMonth,
    name: monthName,
    workingDays,
    notWorkingDays: getDaysCount(year, month) - workingDays,
    shortDays: countShortDays(year, correctMonth),
    workingHours: countWorkingHours(year, month),
  };
};

const generateMonths = (year) => {
  const res = [];
  for (let m = 1; m <= 12; m++) res.push(generateMonth(year, m));
  return res;
};

const isWeekend = (date) => {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

const isWeekendWorking = (date, workingHolidays) => {
  const day = date.getUTCDay();
  return day === 6 && workingHolidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
};

const makeDayInfo = (year, month /* 1-12 */, day) => {
  const date = new Date(Date.UTC(year, month - 1, day));
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);
  const holidays = getHolidays(year);
  const shortDays = getShortDays(year);
  const workingHolidays = getWorkingHolidays(year);
  const isHoliday = holidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
  const isShort = shortDays.some((e) => new Date(e.date).valueOf() === date.valueOf());
  const isWorkingHoliday = isWeekendWorking(date, workingHolidays);

  const result = {
    year: Number(year),
    month: { name: monthName, id: month - 1 },
    date,
    isWorkingDay: !isHoliday && (!isWeekend(date) || isWorkingHoliday),
  };

  if (isHoliday) {
    const holiday = holidays.find((el) => new Date(el.date).valueOf() === date.valueOf());
    if (holiday) result.holiday = holiday.name;
  }
  if (isShort) {
    const shortDay = shortDays.find((el) => new Date(el.date).valueOf() === date.valueOf());
    if (shortDay) {
      result.isShortDay = true;
      result.holiday = shortDay.name;
    }
  }
  return result;
};

// ---- Generate files ----
const outRoot = path.join(process.cwd(), 'public', 'static-api', 'calendar');
ensureDir(outRoot);

// /api/calendar (root endpoint)
writeJSON(path.join(outRoot, 'index.json'), {
  years,
  status: 200,
});

for (const y of years) {
  // /api/calendar/{year}
  writeJSON(path.join(outRoot, `${y}.json`), {
    year: y,
    months: generateMonths(y),
    status: 200,
  });

  // /api/calendar/{year}/holidays
  const holidays = getHolidays(y).map((h) => ({ date: new Date(h.date).toISOString(), name: h.name }));
  const shortDays = getShortDays(y).map((s) => ({ date: new Date(s.date).toISOString(), name: s.name }));
  writeJSON(path.join(outRoot, String(y), 'holidays.json'), {
    year: y,
    holidays,
    shortDays,
    status: 200,
  });

  for (let m = 1; m <= 12; m++) {
    // /api/calendar/{year}/{month} - create both padded and non-padded versions
    const monthData = {
      year: y,
      month: generateMonth(y, m),
      status: 200,
    };
    
    // Zero-padded version (01.json, 02.json, etc.)
    writeJSON(path.join(outRoot, String(y), `${m.toString().padStart(2, '0')}.json`), monthData);
    
    // Non-padded version (1.json, 2.json, etc.) - only for single digits
    if (m < 10) {
      writeJSON(path.join(outRoot, String(y), `${m}.json`), monthData);
    }

    // /api/calendar/{year}/{month}/{day} - create both padded and non-padded versions
    const monthDirPadded = path.join(outRoot, String(y), m.toString().padStart(2, '0'));
    const monthDirNonPadded = path.join(outRoot, String(y), String(m));
    ensureDir(monthDirPadded);
    if (m < 10) {
      ensureDir(monthDirNonPadded);
    }
    
    const daysInMonth = getDaysCount(y, m);
    for (let d = 1; d <= daysInMonth; d++) {
      const info = makeDayInfo(y, m, d);
      const payload = {
        year: info.year,
        month: info.month,
        date: info.date.toISOString(),
        isWorkingDay: info.isWorkingDay,
        status: 200,
      };
      if (info.isShortDay) payload.isShortDay = true;
      if (info.holiday) payload.holiday = info.holiday;
      
      // Zero-padded version (01.json, 02.json, etc.)
      writeJSON(path.join(monthDirPadded, `${d.toString().padStart(2, '0')}.json`), payload);
      
      // Non-padded version (1.json, 2.json, etc.) - only for single digits
      if (d < 10) {
        writeJSON(path.join(monthDirPadded, `${d}.json`), payload);
        if (m < 10) {
          writeJSON(path.join(monthDirNonPadded, `${d}.json`), payload);
        }
      }
    }
  }
}

console.log(`[static-api] Generated static API for years: ${years.join(', ')}`);

