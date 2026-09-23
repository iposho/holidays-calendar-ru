import {
  getHolidays,
  getShortDays,
  getWorkingHolidays,
  getTransferredHolidays,
  getDecree,
  YEAR_SINCE,
  LAST_AVAILABLE_YEAR,
} from '@/utils/holidaysLoader';

describe('holidaysLoader', () => {
  it('должен вернуть массив праздников для 2024 года', () => {
    const holidays = getHolidays(2024);
    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays.length).toBeGreaterThan(0);
  });

  it('должен вернуть массив сокращенных дней для 2024 года', () => {
    const shortDays = getShortDays(2024);
    expect(Array.isArray(shortDays)).toBe(true);
  });

  it('должен вернуть массив рабочих выходных для 2024 года', () => {
    const workingHolidays = getWorkingHolidays(2024);
    expect(Array.isArray(workingHolidays)).toBe(true);
  });

  it('должен вернуть массив праздников для 2026 года', () => {
    const holidays = getHolidays(2026);
    expect(Array.isArray(holidays)).toBe(true);
    expect(holidays.length).toBeGreaterThan(0);
    // Проверяем, что есть новогодние праздники
    const newYearHolidays = holidays.filter((h) => h.name === 'Новогодние каникулы');
    expect(newYearHolidays.length).toBeGreaterThan(0);
  });

  it('должен вернуть массив сокращенных дней для 2026 года', () => {
    const shortDays = getShortDays(2026);
    expect(Array.isArray(shortDays)).toBe(true);
    // В 2026 году должно быть 4 сокращенных дня
    expect(shortDays.length).toBe(4);
  });

  it('должен вернуть пустой массив рабочих выходных для 2026 года', () => {
    const workingHolidays = getWorkingHolidays(2026);
    expect(Array.isArray(workingHolidays)).toBe(true);
    // В 2026 году нет рабочих праздников (переносы добавляют выходные дни)
    expect(workingHolidays.length).toBe(0);
  });

  it('должен содержать все праздники 2026 года по ст. 112 ТК РФ, включая выпавшие на выходные', () => {
    const holidays = getHolidays(2026);
    expect(holidays).toHaveLength(14);

    // 8 марта и 9 мая 2026 года — воскресенье и суббота, но это все равно праздничные дни
    expect(holidays.find((h) => h.date === '2026-03-08')?.name).toBe('Международный женский день');
    expect(holidays.find((h) => h.date === '2026-05-09')?.name).toBe('День Победы');

    // Перенесенные выходные не дублируются в списке праздников
    expect(holidays.find((h) => h.date === '2026-01-09')).toBeUndefined();
    expect(holidays.find((h) => h.date === '2026-12-31')).toBeUndefined();
  });

  it('должен содержать перенесенные выходные 2026 года с исходной датой', () => {
    const transferred = getTransferredHolidays(2026);
    expect(transferred.map(({ date, from }) => ({ date, from }))).toEqual([
      { date: '2026-01-09', from: '2026-01-03' }, // постановление № 1466
      { date: '2026-03-09', from: '2026-03-08' }, // ч. 2 ст. 112 ТК РФ
      { date: '2026-05-11', from: '2026-05-09' }, // ч. 2 ст. 112 ТК РФ
      { date: '2026-12-31', from: '2026-01-04' }, // постановление № 1466
    ]);
    expect(transferred[0].name).toBe('Перенесенный выходной с 3 января');
  });

  it('должен возвращать постановление Правительства РФ со ссылкой', () => {
    const decree = getDecree(2026);
    expect(decree?.number).toBe('1466');
    expect(decree?.date).toBe('2025-09-24');
    expect(decree?.url).toMatch(/^https?:\/\//);
    expect(getDecree(1999)).toBeUndefined();
  });

  it('должен определять диапазон годов по данным', () => {
    expect(YEAR_SINCE).toBe(2023);
    expect(LAST_AVAILABLE_YEAR).toBe(2027);
  });
});
