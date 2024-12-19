export const generateStaticParams = (
  years: number[],
  includeMonths = false,
  includeDays = false,
) => {
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return years.flatMap((year) => {
    const yearStr = year.toString();

    if (includeMonths && includeDays) {
      return months.flatMap((month) => days.map((day) => ({ year: yearStr, month, day })));
    }

    if (includeMonths) {
      return months.map((month) => ({ year: yearStr, month }));
    }

    return { year: yearStr };
  });
};
