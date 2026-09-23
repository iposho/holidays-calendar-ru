#!/usr/bin/env node
/*
  Обновление данных производственного календаря.

  Использование:
    npm run update-calendar -- 2027                  # скачать календарь с consultant.ru и пересобрать данные
    npm run update-calendar -- 2027 --html page.html # взять сохраненную страницу consultant.ru
    npm run update-calendar -- --rebuild             # пересобрать src/data/*.json из сохраненных снимков

  Шаги:
  1. Страница https://www.consultant.ru/law/ref/calendar/proizvodstvennye/{year}/ разбирается в «снимок»
     src/data/consultant/{year}.json (нерабочие и сокращенные дни).
  2. Переносы берутся из src/data/decrees.json (реквизиты постановления Правительства РФ и ссылка на него).
     Для нового года запись нужно добавить вручную — скрипт подскажет номер и дату постановления со страницы.
  3. Из снимка и переносов собираются src/data/{holidays,transferredHolidays,workingHolidays,shortDays}.json.
     Если снимок и переносы противоречат друг другу, скрипт завершится с ошибкой.
*/

const fs = require('fs');
const path = require('path');
const { parseConsultantHtml } = require('./calendar/parseConsultant');
const { buildYearData } = require('./calendar/buildYearData');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const SNAPSHOT_DIR = path.join(DATA_DIR, 'consultant');
const DATA_FILES = {
  holidays: 'holidays.json',
  transferredHolidays: 'transferredHolidays.json',
  workingHolidays: 'workingHolidays.json',
  shortDays: 'shortDays.json',
};

const consultantUrl = (year) => `https://www.consultant.ru/law/ref/calendar/proizvodstvennye/${year}/`;

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');

const sortKeys = (obj) => Object.fromEntries(Object.keys(obj).sort().map((k) => [k, obj[k]]));

const loadHtml = async (year, htmlPath) => {
  if (htmlPath) return fs.readFileSync(htmlPath, 'utf8');
  const url = consultantUrl(year);
  console.log(`[update-calendar] Загрузка ${url}`);
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (holidays-calendar-ru updater)' } });
  if (!res.ok) throw new Error(`consultant.ru ответил ${res.status} ${res.statusText}`);
  return res.text();
};

const saveSnapshot = (parsed) => {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
  const file = path.join(SNAPSHOT_DIR, `${parsed.year}.json`);
  if (fs.existsSync(file)) {
    const prev = readJson(file);
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    if (same(prev.nonWorkingDays, parsed.nonWorkingDays) && same(prev.shortDays, parsed.shortDays)) {
      console.log(`[update-calendar] Снимок ${parsed.year} года не изменился`);
      return;
    }
  }
  const snapshot = {
    year: parsed.year,
    source: consultantUrl(parsed.year),
    note: `Снимок страницы consultant.ru от ${new Date().toISOString().split('T')[0]}`,
    nonWorkingDays: parsed.nonWorkingDays,
    shortDays: parsed.shortDays,
  };
  writeJson(file, snapshot);
  console.log(`[update-calendar] Снимок сохранен: ${path.relative(process.cwd(), file)}`);
};

const checkDecree = (parsed, decrees) => {
  const decree = decrees[parsed.year];
  const found = parsed.decree;
  if (found) {
    const draft = found.isDraft ? ' (на странице указан ПРОЕКТ постановления)' : '';
    console.log(`[update-calendar] На странице: постановление от ${found.date} № ${found.number}${draft}`);
  }
  if (!decree) {
    throw new Error(`В src/data/decrees.json нет записи для ${parsed.year} года. `
      + 'Добавьте реквизиты постановления и список переносов (from -> to) и запустите скрипт снова.');
  }
  if (found && (found.number !== decree.number || found.date !== decree.date)) {
    console.warn(`[update-calendar] ВНИМАНИЕ: в decrees.json указано постановление от ${decree.date} № ${decree.number}`);
  }
};

const rebuildData = (decrees) => {
  const snapshots = fs.readdirSync(SNAPSHOT_DIR)
    .filter((f) => /^\d{4}\.json$/.test(f))
    .map((f) => readJson(path.join(SNAPSHOT_DIR, f)));

  const files = Object.fromEntries(
    Object.entries(DATA_FILES).map(([key, file]) => [key, readJson(path.join(DATA_DIR, file))]),
  );

  snapshots.forEach((snapshot) => {
    const data = buildYearData(snapshot, decrees[snapshot.year]);
    Object.keys(DATA_FILES).forEach((key) => {
      files[key][snapshot.year] = data[key];
    });
  });

  Object.entries(DATA_FILES).forEach(([key, file]) => writeJson(path.join(DATA_DIR, file), sortKeys(files[key])));
  console.log(`[update-calendar] Данные пересобраны для годов: ${snapshots.map((s) => s.year).join(', ')}`);
};

const main = async () => {
  const args = process.argv.slice(2);
  const decrees = readJson(path.join(DATA_DIR, 'decrees.json'));

  if (!args.includes('--rebuild')) {
    const year = Number(args.find((a) => /^\d{4}$/.test(a)));
    if (!year) {
      console.error('Использование: npm run update-calendar -- <год> [--html <файл>] | --rebuild');
      process.exit(1);
    }
    const htmlIndex = args.indexOf('--html');
    const html = await loadHtml(year, htmlIndex !== -1 ? args[htmlIndex + 1] : undefined);
    const parsed = parseConsultantHtml(html, { year });
    checkDecree(parsed, decrees);
    // Проверяем согласованность до записи снимка
    buildYearData(parsed, decrees[year]);
    saveSnapshot(parsed);
  }

  rebuildData(decrees);
  console.log('[update-calendar] Не забудьте запустить тесты: npm test');
};

main().catch((err) => {
  console.error(`[update-calendar] Ошибка: ${err.message}`);
  process.exit(1);
});
