import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

import { isWorkingDay } from '../isWorkingDay';
import { generateMonths } from '../generateMonths';
import { availableYears } from '../availableYears';

// API отдается из файлов, которые собирает scripts/generate-static-api.js.
// Тест проверяет, что файлы совпадают с расчетами, покрытыми остальными тестами.

const ROOT = path.join(process.cwd(), 'public', 'static-api', 'calendar');
const readJson = (...parts: string[]) => JSON.parse(fs.readFileSync(path.join(ROOT, ...parts), 'utf8'));
const pad = (n: number) => String(n).padStart(2, '0');

beforeAll(() => {
  execFileSync('node', [path.join('scripts', 'generate-static-api.js')], { stdio: 'ignore' });
});

describe.each(availableYears())('статический API, %i год', (year) => {
  it('месяцы совпадают с generateMonths', () => {
    expect(readJson(`${year}.json`).months).toEqual(generateMonths(year));
  });

  it('каждый день совпадает с isWorkingDay', () => {
    for (let month = 1; month <= 12; month++) {
      const days = new Date(year, month, 0).getDate();
      for (let day = 1; day <= days; day++) {
        const expected = isWorkingDay(year, month, day);
        const actual = readJson(String(year), pad(month), `${pad(day)}.json`);
        expect({ ...actual, status: undefined }).toEqual({
          year: expected.year,
          month: expected.month,
          date: expected.date.toISOString(),
          isWorkingDay: expected.isWorkingDay,
          isShortDay: expected.isShortDay || false,
          ...(expected.holiday && { holiday: expected.holiday }),
          ...(expected.transferredHoliday && { transferredHoliday: expected.transferredHoliday }),
          status: undefined,
        });
      }
    }
  });
});

describe('iCalendar (RFC 5545)', () => {
  const files = ['index.ics', ...availableYears().map((year) => `${year}.ics`)];

  it.each(files)('%s: строки разделены CRLF и не длиннее 75 байт', (file) => {
    const text = fs.readFileSync(path.join(ROOT, 'ics', file), 'utf8');
    expect(text.endsWith('\r\n')).toBe(true);
    expect(text.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
    text.split('\r\n').forEach((line) => expect(Buffer.byteLength(line, 'utf8')).toBeLessThanOrEqual(75));
  });

  it('экранирует запятые в текстовых значениях и сохраняет UTF-8 при переносе строк', () => {
    const unfolded = fs.readFileSync(path.join(ROOT, 'ics', 'index.ics'), 'utf8').replace(/\r\n /g, '');
    expect(unfolded).toContain('X-WR-CALDESC:Официальные праздники\\, сокращенные дни');
    expect(unfolded).not.toContain('�');
  });
});
