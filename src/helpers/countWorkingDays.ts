import { countWorkingDays as countWorkingDaysImpl } from '../../scripts/calendar/calendarApi';

// month: 0-11
export const countWorkingDays = (year: number, month: number): number => countWorkingDaysImpl(year, month);
