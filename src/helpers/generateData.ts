import { generateMonths } from '@/helpers/generateMonths';
import { generateHolidays } from './generateHolidays';

interface YearData {
  months: any;
  holidays: any;
}

const years = [2023, 2024];

export const generateData = (): Record<number, YearData> => {
  const data: Record<number, YearData> = {};

  years.forEach((year) => {
    data[year] = {
      months: generateMonths(year),
      holidays: generateHolidays(year),
    };
  });

  return data;
};
