import { generateMonths as generateMonthsImpl } from '../../scripts/calendar/calendarApi';

export interface MonthData {
  id: number;
  name: string;
  workingDays: number;
  notWorkingDays: number;
  shortDays: number;
  workingHours: number;
}

export const generateMonths = (year: number): MonthData[] => generateMonthsImpl(year);
