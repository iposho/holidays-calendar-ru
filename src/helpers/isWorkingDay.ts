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

const isWeekendWorking = (date: Date): boolean => {
  const day = date.getUTCDay();
  return day === 6 && getWorkingHolidays(date.getUTCFullYear()).some(
    (e) => new Date(e.date).valueOf() === date.valueOf(),
  );
};

export const isWorkingDay = (year: number, month: number, day: number): WorkingDayResult => {
  const date = new Date(Date.UTC(year, month - 1, day));
  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

  const isHoliday = getHolidays(year).some((e) => new Date(e.date).valueOf() === date.valueOf());
  const isShortDay = getShortDays(year).some((e) => new Date(e.date).valueOf() === date.valueOf());

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
    const holiday = getHolidays(year).find((el) => new Date(el.date).valueOf() === date.valueOf());
    if (holiday) result.holiday = holiday.name;
  }

  if (isShortDay) {
    const shortDay = getShortDays(year).find((el) => new Date(el.date).valueOf() === date.valueOf());
    if (shortDay) {
      result.isShortDay = true;
      result.holiday = shortDay.name;
    }
  }

  return result;
};
