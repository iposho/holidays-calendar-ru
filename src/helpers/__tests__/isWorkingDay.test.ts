import { isWorkingDay } from '../isWorkingDay';

describe('isWorkingDay', () => {
  it('должен вернуть рабочий день', () => {
    const result = isWorkingDay(2024, 5, 15);
    expect(result.isWorkingDay).toBe(true);
  });

  it('должен вернуть праздник', () => {
    const result = isWorkingDay(2024, 1, 1);
    expect(result.isWorkingDay).toBe(false);
    expect(result.holiday).toBeDefined();
  });

  it('должен вернуть сокращенный день', () => {
    const result = isWorkingDay(2024, 2, 22); // 22 февраля — пример сокращенного дня
    expect(result.isShortDay).toBe(true);
  });
});
