import { countShortDays } from '../countShortDays';

describe('countShortDays', () => {
  it('должен считать сокращенные дни в месяце', () => {
    const count = countShortDays(2024, 2); // Февраль обычно имеет сокращенные дни
    expect(count).toBeGreaterThanOrEqual(1);
  });

  it('должен вернуть 0, если сокращенных дней нет', () => {
    const count = countShortDays(2024, 7);
    expect(count).toBe(0);
  });
});
