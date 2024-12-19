import { getHolidays, getShortDays, getWorkingHolidays } from '@/utils/holidaysLoader';

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

const isWeekendWorking = (date: Date, workingHolidays: { date: string }[]): boolean => {
  const day = date.getUTCDay();
  return day === 6 && workingHolidays.some(
    (e) => new Date(e.date).valueOf() === date.valueOf(),
  );
};

export const isWorkingDay = (year: number, month: number, day: number): WorkingDayResult => {
  const date = new Date(Date.UTC(year, month - 1, day));
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  const holidays = getHolidays(year) || [];
  const shortDays = getShortDays(year) || [];
  const workingHolidays = getWorkingHolidays(year) || [];

  const isHoliday = holidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
  const isShortDay = shortDays.some((e) => new Date(e.date).valueOf() === date.valueOf());
  const isWorkingHoliday = isWeekendWorking(date, workingHolidays);

  const result: WorkingDayResult = {
    year: Number(year),
    month: {
      name: monthName,
      id: month - 1,
    },
    date,
    isWorkingDay: !isHoliday && (!isWeekend(date) || isWorkingHoliday),
  };

  if (isHoliday) {
    const holiday = holidays.find((el) => new Date(el.date).valueOf() === date.valueOf());
    if (holiday) result.holiday = holiday.name;
  }

  if (isShortDay) {
    const shortDay = shortDays.find((el) => new Date(el.date).valueOf() === date.valueOf());
    if (shortDay) {
      result.isShortDay = true;
      result.holiday = shortDay.name;
    }
  }

  return result;
};
