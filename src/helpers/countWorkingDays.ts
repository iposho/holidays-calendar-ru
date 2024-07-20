import { h2023, h2024 } from '@/data/holidays';
import { wh2023, wh2024 } from '@/data/workingHolidays';

interface Holiday {
  date: string;
  name: string;
}

type HolidaysFunction = (year?: number) => Holiday[];

const holidays: Record<string, HolidaysFunction> = {
  h2023,
  h2024,
};

const workingHolidays: Record<string, HolidaysFunction> = {
  wh2023,
  wh2024,
};

export const countWorkingDays = (year: number, month: number): number => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));

  while (date.getUTCMonth() === month) {
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const isHoliday = holidays[`h${year}`]().some((e) => new Date(e.date).valueOf() === date.valueOf());
    const isWorkingHoliday = workingHolidays[`wh${year}`]().some((e) => new Date(e.date).valueOf() === date.valueOf());

    if ((!isWeekend && !isHoliday) || (isWeekend && isWorkingHoliday)) {
      count++;
    }

    date.setUTCDate(date.getUTCDate() + 1);
  }
  return count;
};
