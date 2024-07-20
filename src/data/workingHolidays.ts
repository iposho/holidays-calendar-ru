import { createDateString } from '@/helpers/createDateString';

interface WorkingHoliday {
  date: string;
  name: string;
}

type WorkingHolidaysFunction = (year?: number) => WorkingHoliday[];

export const wh2023: WorkingHolidaysFunction = () => [
  // Рабочие праздничных дней не было в 2023 году
];

export const wh2024: WorkingHolidaysFunction = (year = 2024) => [
  createDateString(year, 10, 2, 'День народного единства'),
  createDateString(year, 11, 28, 'Новый год'),
];
