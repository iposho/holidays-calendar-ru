import holidaysSourceData from '@/data/holidays.json';
import shortDaysSourceData from '@/data/shortDays.json';
import workingHolidaysSourceData from '@/data/workingHolidays.json';
import transferredHolidaysSourceData from '@/data/transferredHolidays.json';
import decreesSourceData from '@/data/decrees.json';

import { createDateString } from '@/helpers/createDateString';

// Интерфейс для результирующего объекта дня
export interface Day {
  date: string; // дата в строковом формате
  name: string; // название праздника или события
  isHoliday?: boolean; // является ли день праздничным (для фильтрации в API)
  from?: string; // для перенесенных выходных — исходная дата выходного (YYYY-MM-DD)
}

// Постановление Правительства РФ о переносе выходных дней
export interface Decree {
  title: string; // полное название постановления
  number: string; // номер
  date: string; // дата подписания (YYYY-MM-DD)
  url: string; // ссылка на текст постановления
  calendarUrl: string; // ссылка на производственный календарь (consultant.ru)
  transfers: { from: string; to: string }[]; // переносы выходных дней
}

// Интерфейс для структуры данных в JSON файлах
interface DayData {
  month: number; // номер месяца
  day: number; // день месяца
  name: string; // название
  isHoliday?: boolean; // является ли праздник официальным
  from?: string; // для перенесенных выходных — исходная дата
}

// Интерфейс для годовых данных (ключ - год в виде строки)
interface YearlyData {
  [key: string]: DayData[]; // массив дней для каждого года
}

// Глобальные настройки: диапазон годов определяется по имеющимся данным
const dataYears = Object.keys(holidaysSourceData).map(Number).sort((a, b) => a - b);
export const YEAR_SINCE = dataYears[0];
export const LAST_AVAILABLE_YEAR = dataYears[dataYears.length - 1];

// --- Кэшированные данные ---
// Обрабатывая исходные JSON данные один раз при инициализации модуля,
// мы избегаем повторного парсинга при каждом вызове функции, улучшая производительность.

const processedHolidays: Record<number, Day[]> = {};
const processedShortDays: Record<number, Day[]> = {};
const processedWorkingHolidays: Record<number, Day[]> = {};
const processedTransferredHolidays: Record<number, Day[]> = {};

function processYearData(year: number, sourceData: YearlyData, targetCache: Record<number, Day[]>) {
  const yearData = sourceData[year.toString()] || [];
  const processedData = yearData.map(({
    month, day, name, isHoliday, from,
  }: DayData) => {
    const result: Day = createDateString(year, month, day, name, isHoliday);
    if (from) result.from = from;
    return result;
  });
  // Используем Object.assign для избежания прямого присваивания параметру
  Object.assign(targetCache, { [year]: processedData });
}

for (let year = YEAR_SINCE; year <= LAST_AVAILABLE_YEAR; year++) {
  processYearData(year, holidaysSourceData as YearlyData, processedHolidays);
  processYearData(year, shortDaysSourceData as YearlyData, processedShortDays);
  processYearData(year, workingHolidaysSourceData as YearlyData, processedWorkingHolidays);
  processYearData(year, transferredHolidaysSourceData as YearlyData, processedTransferredHolidays);
}

// --- Конец кэшированных данных ---

// Получение списка праздников для указанного года
export const getHolidays = (year: number): Day[] => processedHolidays[year] || [];

// Получение списка сокращенных дней для указанного года
export const getShortDays = (year: number): Day[] => processedShortDays[year] || [];

// Получение списка рабочих праздников для указанного года
export const getWorkingHolidays = (year: number): Day[] => processedWorkingHolidays[year] || [];

// Получение списка перенесенных праздников для указанного года
export const getTransferredHolidays = (year: number): Day[] => processedTransferredHolidays[year] || [];

// Получение постановления Правительства РФ о переносе выходных дней для указанного года
export const getDecree = (year: number): Decree | undefined => (decreesSourceData as Record<string, Decree>)[year.toString()];
