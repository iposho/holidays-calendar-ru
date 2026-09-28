import { isWorkingDay as isWorkingDayImpl } from '../../scripts/calendar/calendarApi';

export interface WorkingDayResult {
  year: number;
  month: {
    name: string;
    id: number;
  };
  date: Date;
  isWorkingDay: boolean;
  holiday?: string;
  transferredHoliday?: string;
  isTransferredHoliday?: boolean;
  isShortDay?: boolean;
}

// month: 1-12
export const isWorkingDay = (year: number, month: number, day: number): WorkingDayResult => (
  isWorkingDayImpl(year, month, day)
);
