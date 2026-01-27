interface DateString {
  date: string;
  name: string;
  isHoliday?: boolean;
}

export const createDateString = (
  year: number,
  month: number,
  date: number,
  name: string,
  isHoliday?: boolean,
): DateString => ({
  date: new Date(Date.UTC(year, month, date))
    .toISOString()
    .split('T')[0],
  name,
  isHoliday,
});
