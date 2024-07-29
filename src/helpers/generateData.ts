import { generateMonths } from '@/helpers/generateMonths';
import { availableYears } from '@/helpers/availableYears';
import { generateHolidays } from './generateHolidays';

interface YearData {
  months: any;
  holidays: any;
}

const years = availableYears();

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
