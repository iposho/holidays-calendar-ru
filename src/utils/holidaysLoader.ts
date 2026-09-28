import * as calendarApi from '../../scripts/calendar/calendarApi';

// Данные и расчеты реализованы один раз в scripts/calendar/calendarApi.js:
// тот же модуль формирует статический API (scripts/generate-static-api.js)

export interface Day {
  date: string; // дата в формате YYYY-MM-DD
  name: string; // название праздника или события
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

// Диапазон годов определяется по имеющимся данным
export const AVAILABLE_YEARS: number[] = calendarApi.years;
export const YEAR_SINCE = AVAILABLE_YEARS[0];
export const LAST_AVAILABLE_YEAR = AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1];

export const getHolidays = (year: number): Day[] => calendarApi.getHolidays(year);
export const getShortDays = (year: number): Day[] => calendarApi.getShortDays(year);
export const getWorkingHolidays = (year: number): Day[] => calendarApi.getWorkingHolidays(year);
export const getTransferredHolidays = (year: number): Day[] => calendarApi.getTransferredHolidays(year);
export const getDecree = (year: number): Decree | undefined => calendarApi.getDecree(year);
