import { countWorkingDays } from '../countWorkingDays';
import { countShortDays } from '../countShortDays';
import { countWorkingHours } from '../countWorkingHours';

describe('Проверка расчетов для 2026 года', () => {
  it('должен корректно рассчитать рабочие дни и часы для января 2026', () => {
    const workingDays = countWorkingDays(2026, 0); // январь
    const shortDays = countShortDays(2026, 0);
    const workingHours = countWorkingHours(2026, 1); // функция ожидает номер месяца (1-12)
    
    expect(workingDays).toBe(15);
    expect(shortDays).toBe(0);
    expect(workingHours).toBe(120);
  });

  it('должен корректно рассчитать рабочие дни и часы для марта 2026', () => {
    const workingDays = countWorkingDays(2026, 2); // март
    const shortDays = countShortDays(2026, 2);
    const workingHours = countWorkingHours(2026, 3); // функция ожидает номер месяца (1-12)
    
    expect(workingDays).toBe(21);
    expect(shortDays).toBe(0);
    expect(workingHours).toBe(168);
  });

  it('должен корректно рассчитать рабочие дни и часы для мая 2026', () => {
    const workingDays = countWorkingDays(2026, 4); // май
    const shortDays = countShortDays(2026, 4);
    const workingHours = countWorkingHours(2026, 5); // функция ожидает номер месяца (1-12)
    
    expect(workingDays).toBe(19);
    expect(shortDays).toBe(1);
    expect(workingHours).toBe(151);
  });
});
