interface DateString {
  date: string;
  name: string;
}

export const createDateString = (
  year: number,
  month: number,
  date: number,
  name: string,
): DateString => ({
  date: new Date(Date.UTC(year, month, date))
    .toISOString()
    .split('T')[0],
  name,
});
