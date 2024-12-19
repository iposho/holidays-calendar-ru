import { getHolidays, getWorkingHolidays } from '@/utils/holidaysLoader';

export const countWorkingDays = (year: number, month: number): number => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));

  const holidays = getHolidays(year) || [];
  const workingHolidays = getWorkingHolidays(year) || [];

  while (date.getUTCMonth() === month) {
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const isHoliday = holidays.some((e) => new Date(e.date).valueOf() === date.valueOf());
    const isWorkingHoliday = workingHolidays.some((e) => new Date(e.date).valueOf() === date.valueOf());

    if ((!isWeekend && !isHoliday) || (isWeekend && isWorkingHoliday)) {
      count++;
    }

    date.setUTCDate(date.getUTCDate() + 1);
  }
  return count;
};
