import fs from 'fs';
import path from 'path';

import { parseConsultantHtml, extractDecree, extractTransfers } from '../../../scripts/calendar/parseConsultant';
import { buildYearData } from '../../../scripts/calendar/buildYearData';

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const HOLIDAYS = [
  '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07', '01-08',
  '02-23', '03-08', '05-01', '05-09', '06-12', '11-04',
];

interface Snapshot { year: number; nonWorkingDays: string[]; shortDays: string[] }

const iso = (year: number, month: number, day: number) => new Date(Date.UTC(year, month, day)).toISOString().split('T')[0];

/**
 * Рендерит страницу в разметке производственного календаря consultant.ru:
 * таблица на месяц с заголовком `th.month`, дни соседних месяцев — `td.inactively`,
 * праздники — `td.holiday.weekend`, выходные — `td.weekend`, предпраздничные — `td.preholiday` со звездочкой.
 */
const renderConsultantPage = (
  snapshot: Snapshot,
  { markInactive = true, decreeText = '' }: { markInactive?: boolean; decreeText?: string } = {},
): string => {
  const { year } = snapshot;
  const nonWorking = new Set(snapshot.nonWorkingDays);
  const short = new Set(snapshot.shortDays);

  const tables = MONTHS.map((monthName, month) => {
    const first = new Date(Date.UTC(year, month, 1));
    const offset = (first.getUTCDay() + 6) % 7; // Пн = 0
    const cells: string[] = [];
    for (let i = offset; i > 0; i--) {
      const prev = new Date(Date.UTC(year, month, 1 - i)).getUTCDate();
      cells.push(markInactive ? `<td class="inactively">${prev}</td>` : `<td>${prev}</td>`);
    }
    const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    for (let day = 1; day <= total; day++) {
      const date = iso(year, month, day);
      const classes: string[] = [];
      if (HOLIDAYS.includes(date.slice(5))) classes.push('holiday');
      if (nonWorking.has(date)) classes.push('weekend');
      if (short.has(date)) classes.push('preholiday');
      const text = short.has(date) ? `${day}<span>*</span>` : String(day);
      cells.push(classes.length ? `<td class="${classes.join(' ')}">${text}</td>` : `<td>${text}</td>`);
    }
    for (let day = 1; cells.length % 7 !== 0; day++) {
      cells.push(markInactive ? `<td class="inactively">${day}</td>` : `<td>${day}</td>`);
    }
    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(`<tr>${cells.slice(i, i + 7).join('')}</tr>`);
    return `<table class="cal"><thead><tr><th colspan="7" class="month">${monthName}</th></tr>`
      + '<tr><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr></thead>'
      + `<tbody>${rows.join('')}</tbody></table>`;
  });

  return `<html><head><title>Производственный календарь ${year} \\ КонсультантПлюс</title></head><body>`
    + '<div id="header"><table><tr><td>1</td></tr></table></div>'
    + `<div id="content"><h1>Производственный календарь на ${year} год</h1><p>${decreeText}</p>${tables.join('')}`
    + '<table><tr><th>Норма</th></tr><tr><td>247</td></tr></table></div></body></html>';
};

const decrees = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'decrees.json'), 'utf8'),
);

const snapshot2027: Snapshot = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'consultant', '2027.json'), 'utf8'),
);

describe('parseConsultantHtml', () => {
  it('извлекает нерабочие и сокращенные дни из разметки consultant.ru', () => {
    const html = renderConsultantPage(snapshot2027);
    const parsed = parseConsultantHtml(html);

    expect(parsed.year).toBe(2027);
    expect(parsed.nonWorkingDays).toEqual(snapshot2027.nonWorkingDays);
    expect(parsed.shortDays).toEqual(['2027-02-20', '2027-04-30', '2027-06-11', '2027-11-03']);
    expect(parsed.nonWorkingDays).toHaveLength(118);
  });

  it('отбрасывает дни соседних месяцев даже без класса inactively', () => {
    const parsed = parseConsultantHtml(renderConsultantPage(snapshot2027, { markInactive: false }));
    expect(parsed.nonWorkingDays).toEqual(snapshot2027.nonWorkingDays);
    expect(parsed.shortDays).toEqual(snapshot2027.shortDays);
  });

  it('результат парсинга согласуется с постановлением и строит данные', () => {
    const parsed = parseConsultantHtml(renderConsultantPage(snapshot2027));
    const data = buildYearData(parsed, {
      transfers: [
        { from: '2027-01-02', to: '2027-11-05' },
        { from: '2027-01-03', to: '2027-12-31' },
        { from: '2027-02-20', to: '2027-02-22' },
      ],
    });
    expect(data.workingHolidays).toEqual([
      { month: 1, day: 20, name: 'Рабочий день (выходной перенесен на 22 февраля)' },
    ]);
  });

  it('извлекает реквизиты постановления со страницы', () => {
    const html = renderConsultantPage(snapshot2027, {
      decreeText: 'Календарь составлен на основе Постановления Правительства РФ от&nbsp;17.09.2026 N&nbsp;1187 '
        + '"О переносе выходных дней в 2027 году".',
    });
    expect(parseConsultantHtml(html).decree).toEqual({ date: '2026-09-17', number: '1187', isDraft: false });
  });

  it('извлекает переносы выходных, совпадающие с decrees.json', () => {
    const html = renderConsultantPage(snapshot2027, {
      decreeText: 'В 2027 году в соответствии с Постановлением Правительства РФ от 17.09.2026 N 1187 '
        + '"О переносе выходных дней в 2027 году" перенесены следующие выходные дни: с субботы 2 января на пятницу '
        + '5 ноября; с воскресенья 3 января на пятницу 31 декабря; с субботы 20 февраля на понедельник 22 февраля.',
    });
    const parsed = parseConsultantHtml(html);
    expect(parsed.transfers).toEqual(decrees['2027'].transfers);
    expect(() => buildYearData(parsed, { transfers: parsed.transfers })).not.toThrow();
  });

  it('падает, если вместо запрошенного года получена страница другого года', () => {
    // consultant.ru перенаправляет страницы старых лет на текущий год
    expect(() => parseConsultantHtml(renderConsultantPage(snapshot2027), { year: 2024 }))
      .toThrow(/вместо календаря на 2024 год получена страница 2027 года/);
  });

  it('падает с понятной ошибкой, если разметка страницы изменилась', () => {
    expect(() => parseConsultantHtml('<html><title>Календарь 2027</title><body><div id="content"></div></body></html>'))
      .toThrow(/найдено 0 месяцев из 12/);
  });
});

describe('extractDecree', () => {
  it('распознает проект постановления', () => {
    const text = 'В соответствии с Проектом постановления Правительства РФ от 01.08.2026 № 123 перенесены выходные';
    expect(extractDecree(text)).toEqual({ date: '2026-08-01', number: '123', isDraft: true });
  });

  it('возвращает null, если постановление не найдено', () => {
    expect(extractDecree('Производственный календарь')).toBeNull();
  });
});

describe('extractTransfers', () => {
  it('понимает даты с явным годом', () => {
    const text = 'перенесены следующие выходные дни: с субботы 28 декабря 2024 года на понедельник 30 декабря; '
      + 'с воскресенья 7 января на вторник 31 декабря.';
    expect(extractTransfers(text, 2024)).toEqual([
      { from: '2024-12-28', to: '2024-12-30' },
      { from: '2024-01-07', to: '2024-12-31' },
    ]);
  });

  it('возвращает пустой список, если переносов на странице нет', () => {
    expect(extractTransfers('Производственный календарь на 2027 год', 2027)).toEqual([]);
  });
});

describe('buildYearData', () => {
  it('падает, если нерабочий день не объяснен переносом', () => {
    expect(() => buildYearData(snapshot2027, { transfers: [] })).toThrow(/нерабочие дни без объяснения/);
  });

  it('падает, если перенос противоречит источнику', () => {
    expect(() => buildYearData(snapshot2027, {
      transfers: [
        { from: '2027-01-02', to: '2027-11-05' },
        { from: '2027-01-03', to: '2027-12-31' },
        { from: '2027-02-20', to: '2027-02-22' },
        { from: '2027-03-13', to: '2027-03-15' },
      ],
    })).toThrow(/2027-03-15/);
  });
});
