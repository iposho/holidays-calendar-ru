import { createDateString } from '@/helpers/createDateString';

interface WorkingHoliday {
  date: string;
  name: string;
}

type WorkingHolidaysFunction = (year?: number) => WorkingHoliday[];

export const wh2023: WorkingHolidaysFunction = () => [
  // Рабочих выходных дней в 2023 году нет
];

export const wh2024: WorkingHolidaysFunction = (year = 2024) => [
  createDateString(year, 10, 2, 'День народного единства'),
  createDateString(year, 11, 28, 'Новый год'),
];

export const wh2025: WorkingHolidaysFunction = () => [
  // Рабочих выходных дней в 2025 году нет
];
