/*
  Парсер страницы производственного календаря КонсультантПлюс:
  https://www.consultant.ru/law/ref/calendar/proizvodstvennye/{year}/

  Разметка страницы: для каждого месяца есть таблица с заголовком `.month` («Январь», ...),
  дни — ячейки `td`. Классы ячеек:
  - `weekend`     — выходной или нерабочий праздничный день (у праздников дополнительно `holiday`);
  - `preholiday`  — предпраздничный (сокращенный) день, обычно со звездочкой;
  - `nowork`      — нерабочий день по указу Президента (2020–2021 гг.);
  - `inactively`  — день соседнего месяца (пропускается).
*/

const { parse } = require('node-html-parser');
const { MONTHS_RU, MONTHS_RU_GENITIVE, toIso } = require('./core');

const daysInMonth = (year, month /* 0-11 */) => new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

const normalizeSpaces = (text) => text.replace(/[\s ]+/g, ' ').trim();

const extractYear = (root) => {
  const title = root.querySelector('title');
  const h1 = root.querySelector('h1');
  const source = `${title ? title.text : ''} ${h1 ? h1.text : ''}`;
  const match = source.match(/(20\d{2})/);
  return match ? Number(match[1]) : null;
};

// «...постановлением Правительства РФ от 24.09.2025 N 1466...» -> { date: '2025-09-24', number: '1466' }
const extractDecree = (text) => {
  const re = /постановлени[еяюи]м?\s+правительства\s+(?:рф|российской\s+федерации)\s+от\s+(\d{2})\.(\d{2})\.(\d{4})\s*(?:г\.?\s*)?(?:n|№)\s*(\d+)/i;
  const match = text.match(re);
  if (!match) return null;
  const [, dd, mm, yyyy, number] = match;
  return {
    date: `${yyyy}-${mm}-${dd}`,
    number,
    isDraft: /проект[а-я]*\s+постановлени/i.test(text),
  };
};

// «...перенесены следующие выходные дни: с субботы 3 января на пятницу 9 января; ...» ->
// [{ from: '2026-01-03', to: '2026-01-09' }, ...]. Год даты берется из текста («28 декабря 2024 года») или из календаря.
const extractTransfers = (text, year) => {
  const list = text.match(/следующ[а-я]*\s+выходн[а-я]*\s+дн[а-я]*\s*:([^.]*)/i);
  if (!list) return [];
  const months = MONTHS_RU_GENITIVE.join('|');
  const date = `(\\d{1,2})\\s+(${months})(?:\\s+(\\d{4})\\s*(?:г\\.|года?)?)?`;
  const re = new RegExp(`с\\s+[а-я]+\\s+${date}\\s+на\\s+[а-я]+\\s+${date}`, 'gi');
  const toDate = (day, month, y) => toIso(y ? Number(y) : year, MONTHS_RU_GENITIVE.indexOf(month.toLowerCase()), Number(day));
  return [...list[1].matchAll(re)].map((m) => ({
    from: toDate(m[1], m[2], m[3]),
    to: toDate(m[4], m[5], m[6]),
  }));
};

const hasClass = (el, cls) => (el.getAttribute('class') || '').split(/\s+/).includes(cls);

const parseMonthTable = (table, year, month, result) => {
  const total = daysInMonth(year, month);
  let expected = 1;

  table.querySelectorAll('td').forEach((td) => {
    if (expected > total || hasClass(td, 'inactively')) return;
    const digits = normalizeSpaces(td.text).match(/^(\d{1,2})/);
    if (!digits) return;
    const day = Number(digits[1]);
    // Дни соседних месяцев без класса `inactively` отсекаем по порядку следования: 1, 2, ..., N
    if (day !== expected) return;
    expected++;

    const iso = toIso(year, month, day);
    if (hasClass(td, 'weekend') || hasClass(td, 'holiday')) result.nonWorkingDays.push(iso);
    if (hasClass(td, 'preholiday')) result.shortDays.push(iso);
    if (hasClass(td, 'nowork')) result.noWorkDays.push(iso);
  });

  if (expected <= total) {
    throw new Error(`consultant.ru: в таблице «${MONTHS_RU[month]}» найдено ${expected - 1} дней из ${total}`);
  }
};

/**
 * @param {string} html
 * @param {{ year?: number }} [options]
 * @returns {{ year: number, nonWorkingDays: string[], shortDays: string[], noWorkDays: string[],
 *   decree: { date: string, number: string, isDraft: boolean } | null,
 *   transfers: { from: string, to: string }[] }}
 */
const parseConsultantHtml = (html, options = {}) => {
  const root = parse(html);
  const pageYear = extractYear(root);
  const year = options.year || pageYear;
  if (!year) throw new Error('consultant.ru: не удалось определить год календаря');
  // consultant.ru перенаправляет страницы старых лет на текущий год
  if (pageYear && pageYear !== year) {
    throw new Error(`consultant.ru: вместо календаря на ${year} год получена страница ${pageYear} года`);
  }

  const content = root.querySelector('#content') || root;
  const text = normalizeSpaces(content.text);
  const result = {
    year,
    nonWorkingDays: [],
    shortDays: [],
    noWorkDays: [],
    decree: extractDecree(text),
    transfers: extractTransfers(text, year),
  };

  const seenMonths = new Set();
  content.querySelectorAll('table').forEach((table) => {
    const header = table.querySelector('.month');
    if (!header) return;
    const month = MONTHS_RU.indexOf(normalizeSpaces(header.text));
    // На странице могут быть дополнительные таблицы; берем первую таблицу каждого месяца
    if (month === -1 || seenMonths.has(month)) return;
    seenMonths.add(month);
    parseMonthTable(table, year, month, result);
  });

  if (seenMonths.size !== 12) {
    throw new Error(`consultant.ru: найдено ${seenMonths.size} месяцев из 12 — возможно, изменилась разметка страницы`);
  }

  result.nonWorkingDays.sort();
  result.shortDays.sort();
  result.noWorkDays.sort();
  return result;
};

module.exports = { parseConsultantHtml, extractDecree, extractTransfers };
