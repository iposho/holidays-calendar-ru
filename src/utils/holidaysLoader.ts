import holidaysData from '@/data/holidays.json';
import shortDaysData from '@/data/shortDays.json';
import workingHolidaysData from '@/data/workingHolidays.json';

import { createDateString } from '@/helpers/createDateString';

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
export const getHolidays = (year: number): Day[] => {
  const holidays = (holidaysData as YearlyData)[year.toString()] || [];
  return holidays.map(({ month, day, name }: DayData) => createDateString(year, month, day, name));
};

// Получение списка сокращенных дней для указанного года
export const getShortDays = (year: number): Day[] => {
  const days = (shortDaysData as YearlyData)[year.toString()] || [];
  return days.map(({ month, day, name }: DayData) => createDateString(year, month, day, name));
};

// Получение списка рабочих праздников для указанного года
export const getWorkingHolidays = (year: number): Day[] => {
  const days = (workingHolidaysData as YearlyData)[year.toString()] || [];
  return days.map(({ month, day, name }: DayData) => createDateString(year, month, day, name));
};
