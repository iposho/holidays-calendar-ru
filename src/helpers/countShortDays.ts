import { getShortDays } from '@/utils/holidaysLoader';

export const countShortDays = (year: number, month: number): number => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));

  const shortDays = getShortDays(year) || [];

  while (date.getUTCMonth() === month) {
    if (shortDays.some((e) => new Date(e.date).valueOf() === date.valueOf())) {
      count++;
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return count;
};
