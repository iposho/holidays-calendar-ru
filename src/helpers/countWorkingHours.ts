import { countWorkingHours as countWorkingHoursImpl } from '../../scripts/calendar/calendarApi';

// month: 1-12
export const countWorkingHours = (year: number, month: number): number => countWorkingHoursImpl(year, month);
