import holidaysSourceData from '@/data/holidays.json';
import shortDaysSourceData from '@/data/shortDays.json';
import workingHolidaysSourceData from '@/data/workingHolidays.json';

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

// --- Кэшированные данные ---
// Обрабатывая исходные JSON данные один раз при инициализации модуля,
// мы избегаем повторного парсинга при каждом вызове функции, улучшая производительность.

const processedHolidays: Record<number, Day[]> = {};
const processedShortDays: Record<number, Day[]> = {};
const processedWorkingHolidays: Record<number, Day[]> = {};

function processYearData(year: number, sourceData: YearlyData, targetCache: Record<number, Day[]>) {
  const yearData = sourceData[year.toString()] || [];
  const processedData = yearData.map(({ month, day, name }: DayData) => createDateString(year, month, day, name));
  // Используем Object.assign для избежания прямого присваивания параметру
  Object.assign(targetCache, { [year]: processedData });
}

for (let year = YEAR_SINCE; year <= LAST_AVAILABLE_YEAR; year++) {
  processYearData(year, holidaysSourceData as YearlyData, processedHolidays);
  processYearData(year, shortDaysSourceData as YearlyData, processedShortDays);
  processYearData(year, workingHolidaysSourceData as YearlyData, processedWorkingHolidays);
}

// --- Конец кэшированных данных ---

// Получение списка праздников для указанного года
export const getHolidays = (year: number): Day[] => processedHolidays[year] || [];

// Получение списка сокращенных дней для указанного года
export const getShortDays = (year: number): Day[] => processedShortDays[year] || [];

// Получение списка рабочих праздников для указанного года
export const getWorkingHolidays = (year: number): Day[] => processedWorkingHolidays[year] || [];
