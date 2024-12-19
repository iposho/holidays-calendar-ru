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
});
