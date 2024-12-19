import { LAST_AVAILABLE_YEAR, YEAR_SINCE } from '@/utils/holidaysLoader';

export const availableYears = (): number[] => {
  const startYear = YEAR_SINCE;
  const endYear = LAST_AVAILABLE_YEAR;
  const years: number[] = [];

  for (let i = startYear; i <= endYear; i++) {
    years.push(i);
  }

  return years;
};
