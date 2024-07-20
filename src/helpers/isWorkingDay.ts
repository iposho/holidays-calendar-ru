import { h2023, h2024, h2025 } from '@/data/holidays';
import { sh2023, sh2024, sh2025 } from '@/data/shortDays';
import { wh2023, wh2024, wh2025 } from '@/data/workingHolidays';

interface Holiday {
  date: string;
  name: string;
}

type HolidaysFunction = (year?: number) => Holiday[];

const holidays: Record<string, HolidaysFunction> = {
  h2023,
  h2024,
  h2025,
};

const shortDays: Record<string, HolidaysFunction> = {
  sh2023,
  sh2024,
  sh2025,
};

const workingHolidays: Record<string, HolidaysFunction> = {
  wh2023,
  wh2024,
  wh2025,
};

interface WorkingDayResult {
  year: number;
  month: {
    name: string;
    id: number;
  };
  date: Date;
  isWorkingDay: boolean;
  holiday?: string;
  isShortDay?: boolean;
}

const isWeekend = (date: Date): boolean => {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
};

const isWeekendWorking = (date: Date): boolean => {
  const day = date.getUTCDay();
  return day === 6 && workingHolidays[`wh${date.getUTCFullYear()}`]().some((e) => new Date(e.date).valueOf() === date.valueOf());
};

export const isWorkingDay = (year: number, month: number, day: number): WorkingDayResult => {
  const date = new Date(Date.UTC(year, month - 1, day));
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  const isHoliday = holidays[`h${year}`]().some((e) => new Date(e.date).valueOf() === date.valueOf());
  const isShortDay = shortDays[`sh${year}`]().some((e) => new Date(e.date).valueOf() === date.valueOf());

  const result: WorkingDayResult = {
    year: Number(year),
    month: {
      name: monthName,
      id: month - 1,
    },
    date,
    isWorkingDay: !isHoliday && (isShortDay || (!isWeekend(date) || isWeekendWorking(date))),
  };

  if (isHoliday) {
    const holiday = holidays[`h${year}`]().find((el) => new Date(el.date).valueOf() === date.valueOf());
    if (holiday) result.holiday = holiday.name;
  }

  if (isShortDay) {
    const shortDay = shortDays[`sh${year}`]().find((el) => new Date(el.date).valueOf() === date.valueOf());
    if (shortDay) {
      result.isShortDay = true;
      result.holiday = shortDay.name;
    }
  }

  return result;
};
