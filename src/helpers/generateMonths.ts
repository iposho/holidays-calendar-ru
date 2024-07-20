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

export const generateMonths = (year: number): MonthData[] => {
  const months: MonthData[] = [];
  // eslint-disable-next-line no-plusplus
  for (let month = 0; month < 12; month++) {
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month, 1));
    const workingDays = countWorkingDays(year, month);

    const obj: MonthData = {
      id: month,
      name: monthName,
      workingDays,
      notWorkingDays: getDaysCount(year, month + 1) - workingDays,
      shortDays: countShortDays(year, month),
      workingHours: countWorkingHours(year, month + 1),
    };

    months.push(obj);
  }
  return months;
};
