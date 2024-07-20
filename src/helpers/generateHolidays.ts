import { holidays } from '@/data/holidays';
import { shortDays } from '@/data/shortDays';

interface Holiday {
  date: Date;
  name: string;
}

interface HolidaysData {
  holidays: Holiday[];
  shortDays: Holiday[];
}

export const generateHolidays = (year: number): HolidaysData => {
  const holidaysArray: Holiday[] = holidays[`h${year}`]().map((i: { date: string; name: string }) => ({
    date: new Date(i.date),
    name: i.name,
  }));

  const shortDaysArray: Holiday[] = shortDays[`sh${year}`]().map((i: { date: string; name: string }) => ({
    date: new Date(i.date),
    name: i.name,
  }));

  return {
    holidays: holidaysArray,
    shortDays: shortDaysArray,
  };
};
