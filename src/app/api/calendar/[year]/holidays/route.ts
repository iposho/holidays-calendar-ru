import { NextRequest, NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';
import { isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';

const data = generateData();

export async function generateStaticParams() {
  const years = [2023, 2024];
  return years.map((year) => ({ year: year.toString() }));
}

export async function GET(req: NextRequest, { params }: { params: { year: string } }) {
  const { year } = params;

  if (isNotCorrectYear(Number(year))) {
    return NextResponse.json(getErrorMessages('year'), { status: 400 });
  }

  const yearData = data[Number(year)];

  if (!yearData) {
    return NextResponse.json(getErrorMessages('year'), { status: 400 });
  }

  const holidays = yearData.holidays.holidays.map((holiday: { date: string; name: string }) => ({
    date: new Date(holiday.date).toISOString(),
    name: holiday.name,
  }));

  const shortDays = yearData.holidays.shortDays.map((shortDay: { date: string; name: string }) => ({
    date: new Date(shortDay.date).toISOString(),
    name: shortDay.name,
  }));

  return NextResponse.json({
    year: Number(year),
    holidays,
    shortDays,
    status: 200,
  });
}
