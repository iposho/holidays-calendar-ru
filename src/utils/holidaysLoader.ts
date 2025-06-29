import holidaysData from '@/data/holidays.json';
import shortDaysData from '@/data/shortDays.json';
import workingHolidaysData from '@/data/workingHolidays.json';

import { createDateString } from '@/helpers/createDateString';

// Кэш для сохранения результатов вычислений
const holidaysCache = new Map<number, Day[]>();
const shortDaysCache = new Map<number, Day[]>();
const workingHolidaysCache = new Map<number, Day[]>();

// Интерфейс для результирующего объекта дня
export interface Day {
  date: string; // дата в строковом формате
  name: string; // название праздника или события
}

// Интерфейс для структуры данных в JSON файлах
interface DayData {
  month: number; // номер месяца
  day: number; // день месяца
  name: string; // название
}

// Интерфейс для годовых данных (ключ - год в виде строки)
interface YearlyData {
  [key: string]: DayData[]; // массив дней для каждого года
}

// Глобальные настройки
export const YEAR_SINCE = 2023;
export const LAST_AVAILABLE_YEAR = 2025;

// Получение списка праздников для указанного года
// Получение списка праздников для указанного года
export const getHolidays = (year: number): Day[] => {
  if (holidaysCache.has(year)) {
    return holidaysCache.get(year)!;
  }

  const holidays = (holidaysData as YearlyData)[year.toString()] || [];
  const mapped = holidays.map(({ month, day, name }: DayData) => createDateString(year, month, day, name));

  holidaysCache.set(year, mapped);

  return mapped;
};

// Получение списка сокращенных дней для указанного года
export const getShortDays = (year: number): Day[] => {
  if (shortDaysCache.has(year)) {
    return shortDaysCache.get(year)!;
  }

  const days = (shortDaysData as YearlyData)[year.toString()] || [];
  const mapped = days.map(({ month, day, name }: DayData) => createDateString(year, month, day, name));

  shortDaysCache.set(year, mapped);

  return mapped;
};

// Получение списка рабочих праздничных дней для указанного года
export const getWorkingHolidays = (year: number): Day[] => {
  if (workingHolidaysCache.has(year)) {
    return workingHolidaysCache.get(year)!;
  }

  const days = (workingHolidaysData as YearlyData)[year.toString()] || [];
  const mapped = days.map(({ month, day, name }: DayData) => createDateString(year, month, day, name));

  workingHolidaysCache.set(year, mapped);

  return mapped;
};
