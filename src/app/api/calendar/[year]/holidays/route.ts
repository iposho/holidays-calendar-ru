import { NextRequest, NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';
import { isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';

import { generateStaticParams as generateParams } from '@/utils/generateStaticParams';

export async function generateStaticParams() {
  return generateParams([2023, 2024]);
}

const data = generateData();

export async function GET(req: NextRequest, { params }: { params: { year: string } }) {
  const { year } = params;

  if (isNotCorrectYear(Number(year))) {
    const error = getErrorMessages('year');
    return NextResponse.json(error, { status: error.status });
  }

  const yearData = data[Number(year)];

  if (!yearData) {
    const error = getErrorMessages('not_found');
    return NextResponse.json(error, { status: error.status });
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
