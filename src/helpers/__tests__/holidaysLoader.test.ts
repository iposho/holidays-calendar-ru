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
    // В 2026 году нет рабочих праздников
    expect(workingHolidays.length).toBe(0);
  });
});
