import { generateData } from '@/helpers/generateData';

interface Holiday {
  date: string;
  name: string;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

export function generateICSContent(year: number): string {
  const data = generateData();
  const yearData = data[year];
  const { holidays, shortDays } = yearData.holidays;

  const generateEvent = (item: Holiday, type: 'holiday' | 'shortday'): string => {
    const date = new Date(item.date);
    const formattedDate = formatDate(date);
    const nextDay = formatDate(new Date(date.getTime() + 86400000));

    return [
      'BEGIN:VEVENT',
      `DTSTART;VALUE=DATE:${formattedDate}`,
      `DTEND;VALUE=DATE:${nextDay}`,
      'TRANSP:TRANSPARENT',
      `SUMMARY:${type === 'holiday' ? item.name : 'Сокращенный рабочий день'}`,
      `DESCRIPTION:${type === 'holiday' ? 'Праздничный день в России' : item.name}`,
      `UID:${type}-${date.getTime()}@holidays-calendar-ru`,
      'END:VEVENT',
    ].join('\r\n');
  };

  const eventsContent = [
    ...holidays.map((h: Holiday) => generateEvent(h, 'holiday')),
    ...shortDays.map((s: Holiday) => generateEvent(s, 'shortday')),
  ].join('\r\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//holidays-calendar-ru//RU Holidays//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Праздники России ${year}`,
    'X-WR-TIMEZONE:Europe/Moscow',
    eventsContent,
    'END:VCALENDAR',
  ].join('\r\n');
}
