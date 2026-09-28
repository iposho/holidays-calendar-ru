import { countShortDays as countShortDaysImpl } from '../../scripts/calendar/calendarApi';

// month: 0-11
export const countShortDays = (year: number, month: number): number => countShortDaysImpl(year, month);
