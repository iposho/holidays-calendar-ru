import { countWorkingDays } from './countWorkingDays';
import { getDaysCount } from './getDaysCount';
import { countShortDays } from './countShortDays';
import { countWorkingHours } from './countWorkingHours';

interface MonthData {
  id: number;
  name: string;
  workingDays: number;
  notWorkingDays: number;
  shortDays: number;
  workingHours: number;
}

export const generateMonth = (year: number, month: number): MonthData => {
  const correctMonth = month - 1;
  const workingDays = countWorkingDays(year, correctMonth);

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, correctMonth, 1));

  return {
    id: correctMonth,
    name: monthName,
    workingDays,
    notWorkingDays: getDaysCount(year, month) - workingDays,
    shortDays: countShortDays(year, correctMonth),
    workingHours: countWorkingHours(year, month),
  };
};
