import { generateMonths } from '@/helpers/generateMonths';
import { availableYears } from '@/helpers/availableYears';
import { generateHolidays } from './generateHolidays';

interface YearData {
  months: any;
  holidays: any;
}

const years = availableYears();

// Кэш данных для повторного использования между вызовами
let cachedData: Record<number, YearData> | null = null;

// Генерация данных для всех доступных годов
export const generateData = (): Record<number, YearData> => {
  if (cachedData) {
    return cachedData;
  }

  const data: Record<number, YearData> = {};

  years.forEach((year) => {
    data[year] = {
      months: generateMonths(year),
      holidays: generateHolidays(year),
    };
  });

  cachedData = data;
  return data;
};
