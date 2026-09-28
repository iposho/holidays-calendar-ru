/*
  Generates a fully static version of the API under public/static-api.
  It mirrors the responses of existing /api/calendar routes as JSON files.
*/

const fs = require('fs');
const path = require('path');

const {
  years,
  getDaysCount,
  getHolidays,
  getShortDays,
  getWorkingHolidays,
  getTransferredHolidays,
  getDecree: getFullDecree,
  generateMonth,
  generateMonths,
  isWorkingDay,
} = require('./calendar/calendarApi');

// ---- Utils ----
const ensureDir = (dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
};

const writeJSON = (filePath, obj) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(obj), 'utf8');
};

const writeText = (filePath, text) => {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, text, 'utf8');
};

const toIsoDate = (date) => date.toISOString().split('T')[0];

// Постановление Правительства РФ о переносе выходных дней (без внутреннего списка переносов)
const getDecree = (year) => {
  const decree = getFullDecree(year);
  if (!decree) return null;
  return {
    title: decree.title,
    number: decree.number,
    date: decree.date,
    url: decree.url,
    calendarUrl: decree.calendarUrl,
  };
};

// ---- ICS ----
const UID_PREFIX = {
  holiday: 'H', short: 'S', transferred: 'T', working: 'W',
};

const generateStableUid = (date, type, name) => {
  // Создаем стабильный UID на основе даты, типа и названия события
  const dateStr = date.replace(/-/g, '');
  const nameHash = Buffer.from(name, 'utf8').toString('base64').replace(/[^A-Za-z0-9]/g, '').substring(0, 8);
  return `${dateStr}-${UID_PREFIX[type]}-${nameHash}@kuzyak.in`;
};

const DTSTAMP = `${new Date().toISOString().replace(/[:.-]/g, '').substring(0, 15)}Z`;

// Событие на весь день: DTEND — следующий день (не включительно)
const icsEvent = (day, type, summary, category) => {
  const start = new Date(`${day.date}T00:00:00Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  const toIcsDate = (date) => toIsoDate(date).replace(/-/g, '');
  return [
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${toIcsDate(start)}`,
    `DTEND;VALUE=DATE:${toIcsDate(end)}`,
    `DTSTAMP:${DTSTAMP}`,
    `UID:${generateStableUid(day.date, type, day.name)}`,
    `SUMMARY:${summary}`,
    ...(category ? [`CATEGORIES:${category}`] : []),
    'END:VEVENT',
  ].join('\n');
};

// Праздники и перенесенные выходные не пересекаются: это проверяет scripts/calendar/buildYearData.js
const generateIcsEvents = (year) => [
  ...getHolidays(year).map((h) => icsEvent(h, 'holiday', h.name)),
  ...getShortDays(year).map((s) => icsEvent(s, 'short', `${s.name} (сокращенный день)`, 'SHORT_DAY')),
  ...getWorkingHolidays(year).map((w) => icsEvent(w, 'working', w.name, 'WORKING_HOLIDAY')),
  ...getTransferredHolidays(year).map((t) => icsEvent(t, 'transferred', t.name, 'TRANSFERRED_HOLIDAY')),
];

const generateIcs = (year) => [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//kuzyak.in//NONSGML Production Calendar//EN',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  `X-WR-CALNAME:Производственный календарь ${year}`,
  'X-WR-TIMEZONE:Europe/Moscow',
  ...generateIcsEvents(year),
  'END:VCALENDAR',
].join('\n');

const generateSubscriptionIcs = (allYears) => [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//kuzyak.in//NONSGML Production Calendar//EN',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
  'X-WR-CALNAME:Производственный календарь РФ',
  'X-WR-CALDESC:Официальные праздники, сокращенные дни и переносы выходных дней в Российской Федерации',
  'X-WR-TIMEZONE:Europe/Moscow',
  'REFRESH-INTERVAL;VALUE=DURATION:P1W',
  'X-PUBLISHED-TTL:P1W',
  ...allYears.flatMap((year) => generateIcsEvents(year)),
  'END:VCALENDAR',
].join('\n');

// ---- Generate files ----
const outRoot = path.join(process.cwd(), 'public', 'static-api', 'calendar');
ensureDir(outRoot);

// /api/calendar (root endpoint)
writeJSON(path.join(outRoot, 'index.json'), {
  years,
  status: 200,
});

// /api/calendar/ics (Subscription endpoint with all available years)
const subscriptionIcs = generateSubscriptionIcs(years);
writeText(path.join(outRoot, 'ics', 'index.ics'), subscriptionIcs);

for (const y of years) {
  // /api/calendar/{year}
  writeJSON(path.join(outRoot, `${y}.json`), {
    year: y,
    months: generateMonths(y),
    decree: getDecree(y),
    status: 200,
  });

  // /api/calendar/{year}/ics
  const icsData = generateIcs(y);
  writeText(path.join(outRoot, 'ics', `${y}.ics`), icsData);
  const legacyIcs = path.join(outRoot, `${y}.ics`);
  if (fs.existsSync(legacyIcs)) {
    fs.unlinkSync(legacyIcs);
  }

  // /api/calendar/{year}/holidays
  const holidays = getHolidays(y).map((h) => ({ date: new Date(h.date).toISOString(), name: h.name }));
  const shortDays = getShortDays(y).map((s) => ({ date: new Date(s.date).toISOString(), name: s.name }));
  const transferredHolidays = getTransferredHolidays(y).map((th) => ({
    date: new Date(th.date).toISOString(),
    name: th.name,
    from: new Date(th.from).toISOString(),
  }));
  const workingWeekends = getWorkingHolidays(y).map((w) => ({ date: new Date(w.date).toISOString(), name: w.name }));
  writeJSON(path.join(outRoot, String(y), 'holidays.json'), {
    year: y,
    holidays,
    shortDays,
    transferredHolidays,
    workingWeekends,
    decree: getDecree(y),
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
      const info = isWorkingDay(y, m, d);
      const payload = {
        year: info.year,
        month: info.month,
        date: info.date.toISOString(),
        isWorkingDay: info.isWorkingDay,
        isShortDay: info.isShortDay || false,
        status: 200,
      };
      if (info.holiday) payload.holiday = info.holiday;
      if (info.transferredHoliday) payload.transferredHoliday = info.transferredHoliday;

      // Zero-padded version (01.json, 02.json, etc.)
      writeJSON(path.join(monthDirPadded, `${d.toString().padStart(2, '0')}.json`), payload);

      // Non-padded version (1.json, 2.json, etc.) - only for single digits
      if (d < 10) {
        writeJSON(path.join(monthDirPadded, `${d}.json`), payload);
        if (m < 10) {
          writeJSON(path.join(monthDirNonPadded, `${d}.json`), payload);
        }
      }

      // Zero-padded version in non-padded month directory (for mixed paths like /2023/1/05)
      if (m < 10) {
        writeJSON(path.join(monthDirNonPadded, `${d.toString().padStart(2, '0')}.json`), payload);
      }
    }
  }
}

console.log(`[static-api] Generated static API for years: ${years.join(', ')}`);

