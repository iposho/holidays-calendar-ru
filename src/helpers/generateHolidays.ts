import { getHolidays, getShortDays } from '@/utils/holidaysLoader';

interface Holiday {
  date: Date;
  name: string;
  isHoliday?: boolean;
}

interface HolidaysData {
  holidays: Holiday[];
  shortDays: Holiday[];
}

export const generateHolidays = (year: number): HolidaysData => {
  const holidaysArray: Holiday[] = getHolidays(year).map((i) => ({
    date: new Date(i.date),
    name: i.name,
    isHoliday: i.isHoliday,
  }));

  const shortDaysArray: Holiday[] = getShortDays(year).map((i) => ({
    date: new Date(i.date),
    name: i.name,
  }));

  return {
    holidays: holidaysArray,
    shortDays: shortDaysArray,
  };
};
