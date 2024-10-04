import { createDateString } from '@/helpers/createDateString';

export interface ShortDay {
  date: string;
  name: string;
}

export type ShortDaysFunction = (year?: number) => ShortDay[];

export const sh2023: ShortDaysFunction = (year = 2023) => [
  createDateString(year, 1, 22, 'День защитника Отечества'),
  createDateString(year, 2, 7, 'Международный женский день'),
  createDateString(year, 10, 3, 'День народного единства'),
];

export const sh2024: ShortDaysFunction = (year = 2024) => [
  createDateString(year, 1, 22, 'День защитника Отечества'),
  createDateString(year, 2, 7, 'Международный женский день'),
  createDateString(year, 4, 8, 'День Победы'),
  createDateString(year, 5, 11, 'День России'),
  createDateString(year, 10, 2, 'День народного единства'),
];

export const sh2025: ShortDaysFunction = (year = 2025) => [
  createDateString(year, 2, 7, 'Международный женский день'),
  createDateString(year, 3, 30, 'День Труда'),
  createDateString(year, 10, 1, 'День народного единства'),
  createDateString(year, 5, 11, 'День России'),
];

export const shortDays: Record<string, ShortDaysFunction> = {
  sh2023,
  sh2024,
  sh2025,
};
