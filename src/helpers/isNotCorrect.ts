import { LAST_AVAILABLE_YEAR, YEAR_SINCE } from '@/utils/holidaysLoader';
import { getDaysCount } from './getDaysCount';

export const isNotCorrectYear = (year: number): boolean => year < YEAR_SINCE || year > LAST_AVAILABLE_YEAR;
export const isNotCorrectMonth = (month: number): boolean => month < 1 || month > 12;
export const isNotCorrectDay = (year: number, month: number, day: number): boolean => day < 1 || day > getDaysCount(year, month);
