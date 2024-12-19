import { countWorkingDays } from '../countWorkingDays';

describe('countWorkingDays', () => {
  it('должен считать рабочие дни в месяце', () => {
    const count = countWorkingDays(2024, 5);
    expect(count).toBeGreaterThan(15);
  });

  it('должен вернуть 0 для некорректного месяца', () => {
    const count = countWorkingDays(2024, 13);
    expect(count).toBe(0);
  });
});
