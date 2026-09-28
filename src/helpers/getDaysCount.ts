import { getDaysCount as getDaysCountImpl } from '../../scripts/calendar/calendarApi';

// month: 1-12
export const getDaysCount = (year: number, month: number): number => getDaysCountImpl(year, month);
