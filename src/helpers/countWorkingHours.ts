import { countWorkingDays } from './countWorkingDays';
import { countShortDays } from './countShortDays';

export const countWorkingHours = (year: number, month: number): number => {
  const workingDays = countWorkingDays(year, month - 1);
  const shortDays = countShortDays(year, month - 1);

  return (workingDays * 8) - shortDays;
};
