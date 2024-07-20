import {
  sh2023,
  sh2024,
  sh2025,
  ShortDaysFunction,
} from '@/data/shortDays';

const shortDays: Record<string, ShortDaysFunction> = {
  sh2023,
  sh2024,
  sh2025,
};

export const countShortDays = (year: number, month: number): number => {
  let count = 0;
  const date = new Date(Date.UTC(year, month, 1));

  while (date.getUTCMonth() === month) {
    if (shortDays[`sh${year}`]().some((e) => new Date(e.date).valueOf() === date.valueOf())) {
      count++;
    }
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return count;
};
