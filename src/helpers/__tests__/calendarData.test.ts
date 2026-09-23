import fs from 'fs';
import path from 'path';

import holidaysData from '@/data/holidays.json';
import shortDaysData from '@/data/shortDays.json';
import workingHolidaysData from '@/data/workingHolidays.json';
import transferredHolidaysData from '@/data/transferredHolidays.json';
import decrees from '@/data/decrees.json';
import { availableYears } from '@/helpers/availableYears';
import { getTransferredHolidays, getWorkingHolidays } from '@/utils/holidaysLoader';
import { buildYearData } from '../../../scripts/calendar/buildYearData';
import { countWorkingDays } from '../countWorkingDays';
import { countWorkingHours } from '../countWorkingHours';
import { isWorkingDay } from '../isWorkingDay';

interface Snapshot {
  year: number;
  nonWorkingDays: string[];
  shortDays: string[];
}

type YearlyData = Record<string, unknown[]>;
type DecreeData = { number: string; date: string; url: string; transfers: { from: string; to: string }[] };

const snapshotDir = path.join(__dirname, '..', '..', 'data', 'consultant');
const loadSnapshot = (year: number): Snapshot => JSON.parse(fs.readFileSync(path.join(snapshotDir, `${year}.json`), 'utf8'));
const decreeOf = (year: number): DecreeData => (decrees as Record<string, DecreeData>)[year];

// Официальные нормы рабочего времени при пятидневной 40-часовой рабочей неделе
const OFFICIAL_NORMS: Record<number, { workingDays: number; workingHours: number }> = {
  2023: { workingDays: 247, workingHours: 1973 },
  2024: { workingDays: 248, workingHours: 1979 },
  2025: { workingDays: 247, workingHours: 1972 },
  2026: { workingDays: 247, workingHours: 1972 },
  2027: { workingDays: 247, workingHours: 1972 },
};

const datesOfYear = (year: number): Date[] => {
  const dates: Date[] = [];
  const date = new Date(Date.UTC(year, 0, 1));
  while (date.getUTCFullYear() === year) {
    dates.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return dates;
};

describe('данные производственного календаря', () => {
  const years = availableYears();

  it('охватывают непрерывный диапазон годов начиная с 2023', () => {
    expect(years[0]).toBe(2023);
    expect(years[years.length - 1]).toBeGreaterThanOrEqual(2027);
    const expected = Array.from(
      { length: years[years.length - 1] - 2023 + 1 },
      (_, i) => 2023 + i,
    );
    expect(years).toEqual(expected);
  });

  describe.each(years)('%i год', (year) => {
    const snapshot = loadSnapshot(year);

    it('имеет постановление Правительства РФ со ссылкой', () => {
      const decree = decreeOf(year);
      expect(decree).toBeDefined();
      expect(decree.number).toMatch(/^\d+$/);
      expect(decree.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(decree.url).toMatch(/^https?:\/\//);
    });

    it('совпадает с официальной годовой нормой рабочего времени', () => {
      let workingDays = 0;
      let workingHours = 0;
      for (let month = 0; month < 12; month++) {
        workingDays += countWorkingDays(year, month);
        workingHours += countWorkingHours(year, month + 1);
      }
      const expectedNorm = OFFICIAL_NORMS[year] ?? {
        workingDays: datesOfYear(year).length - snapshot.nonWorkingDays.length,
        workingHours: (datesOfYear(year).length - snapshot.nonWorkingDays.length) * 8 - snapshot.shortDays.length,
      };
      expect({ workingDays, workingHours }).toEqual(expectedNorm);
    });

    it('каждый день совпадает с производственным календарем consultant.ru', () => {
      const nonWorking = new Set(snapshot.nonWorkingDays);
      const short = new Set(snapshot.shortDays);
      const mismatches = datesOfYear(year)
        .map((date) => {
          const iso = date.toISOString().split('T')[0];
          const info = isWorkingDay(year, date.getUTCMonth() + 1, date.getUTCDate());
          const expectedWorking = !nonWorking.has(iso);
          const expectedShort = short.has(iso);
          return info.isWorkingDay === expectedWorking && Boolean(info.isShortDay) === expectedShort ? null : iso;
        })
        .filter(Boolean);
      expect(mismatches).toEqual([]);
    });

    it('src/data/*.json собраны из снимка и постановления (npm run update-calendar -- --rebuild)', () => {
      const built = buildYearData(snapshot, decreeOf(year));
      expect((holidaysData as YearlyData)[year]).toEqual(built.holidays);
      expect((shortDaysData as YearlyData)[year]).toEqual(built.shortDays);
      expect((workingHolidaysData as YearlyData)[year]).toEqual(built.workingHolidays);
      expect((transferredHolidaysData as YearlyData)[year]).toEqual(built.transferredHolidays);
    });

    it('отражает все переносы из постановления', () => {
      const transferred = getTransferredHolidays(year);
      const workingWeekends = getWorkingHolidays(year).map((d) => d.date);
      decreeOf(year).transfers.forEach(({ from, to }) => {
        expect(transferred).toContainEqual(expect.objectContaining({ date: to, from }));
        // Если перенесен обычный выходной (не праздник), он становится рабочим днем
        if (!snapshot.nonWorkingDays.includes(from)) expect(workingWeekends).toContain(from);
      });
    });
  });
});

describe('перенесенные выходные (issue #84)', () => {
  it('9 января 2026 — перенесенный выходной с 3 января, а не праздник', () => {
    const day = isWorkingDay(2026, 1, 9);
    expect(day.isWorkingDay).toBe(false);
    expect(day.holiday).toBeUndefined();
    expect(day.isTransferredHoliday).toBe(true);
    expect(day.transferredHoliday).toBe('Перенесенный выходной с 3 января');
  });

  it('31 декабря 2026 — нерабочий день (перенос с 4 января)', () => {
    const day = isWorkingDay(2026, 12, 31);
    expect(day.isWorkingDay).toBe(false);
    expect(day.transferredHoliday).toBe('Перенесенный выходной с 4 января');
  });

  it('2027: суббота 20 февраля — рабочий сокращенный день, 22 февраля — выходной', () => {
    const saturday = isWorkingDay(2027, 2, 20);
    expect(saturday.isWorkingDay).toBe(true);
    expect(saturday.isShortDay).toBe(true);

    const monday = isWorkingDay(2027, 2, 22);
    expect(monday.isWorkingDay).toBe(false);
    expect(monday.transferredHoliday).toBe('Перенесенный выходной с 20 февраля');
  });

  it('2027: переносы по постановлению № 1187 и по ст. 112 ТК РФ', () => {
    expect(getTransferredHolidays(2027).map(({ date, from }) => [date, from])).toEqual([
      ['2027-02-22', '2027-02-20'],
      ['2027-05-03', '2027-05-01'],
      ['2027-05-10', '2027-05-09'],
      ['2027-06-14', '2027-06-12'],
      ['2027-11-05', '2027-01-02'],
      ['2027-12-31', '2027-01-03'],
    ]);
  });

  it('2024: суббота 27 апреля — рабочий день, 29 апреля — выходной', () => {
    expect(isWorkingDay(2024, 4, 27).isWorkingDay).toBe(true);
    expect(isWorkingDay(2024, 4, 29).isWorkingDay).toBe(false);
  });

  it('январь 2027: 15 рабочих дней, 120 часов', () => {
    expect(countWorkingDays(2027, 0)).toBe(15);
    expect(countWorkingHours(2027, 1)).toBe(120);
  });
});
