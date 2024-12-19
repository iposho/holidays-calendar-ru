import { getHolidays, getWorkingHolidays } from '@/utils/holidaysLoader';

export const countWorkingDays = (year: number, month: number): number => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));

  while (date.getUTCMonth() === month) {
    const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;
    const isHoliday = getHolidays(year).some((e) => new Date(e.date).valueOf() === date.valueOf());
    const isWorkingHoliday = getWorkingHolidays(year).some((e) => new Date(e.date).valueOf() === date.valueOf());

    if ((!isWeekend && !isHoliday) || (isWeekend && isWorkingHoliday)) {
      count++;
    }

    date.setUTCDate(date.getUTCDate() + 1);
  }
  return count;
};
