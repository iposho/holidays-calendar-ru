import { getHolidays, getShortDays, getWorkingHolidays } from '@/utils/holidaysLoader';

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
    const newYearHolidays = holidays.filter((h) => h.name === 'Новый год');
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

  it('должен содержать перенесенные праздники для 2026 года', () => {
    const holidays = getHolidays(2026);

    // Проверяем наличие перенесенного праздника 9 марта (компенсация за 8 марта в воскресенье)
    const march9Holiday = holidays.find((h) => h.date === '2026-03-09');
    expect(march9Holiday).toBeDefined();
    expect(march9Holiday?.name).toBe('Международный женский день');

    // Проверяем наличие перенесенного праздника 11 мая (компенсация за 9 мая в субботу)
    const may11Holiday = holidays.find((h) => h.date === '2026-05-11');
    expect(may11Holiday).toBeDefined();
    expect(may11Holiday?.name).toBe('День Победы');

    // Проверяем, что 8 марта НЕ является праздником (перенесен на 9 марта)
    const march8Holiday = holidays.find((h) => h.date === '2026-03-08');
    expect(march8Holiday).toBeUndefined();

    // Проверяем, что 9 мая НЕ является праздником (перенесен на 11 мая)
    const may9Holiday = holidays.find((h) => h.date === '2026-05-09');
    expect(may9Holiday).toBeUndefined();
  });
});
