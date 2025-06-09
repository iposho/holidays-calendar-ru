import { NextRequest, NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';
import { isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { CACHE_CONFIG } from '@/config/cache';

import { generateStaticParams as generateParams } from '@/utils/generateStaticParams';

export async function generateStaticParams() {
  return generateParams([2023, 2024, 2025, 2026, 2027]);
}

const data = generateData();

export const dynamic = 'force-static';
export const revalidate = CACHE_CONFIG.DEFAULT_REVALIDATE;

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

  return new NextResponse(JSON.stringify({
    year: Number(year),
    holidays,
    shortDays,
    status: 200,
  }), {
    status: 200,
    headers: {
      'Cache-Control': `public, s-maxage=${CACHE_CONFIG.DEFAULT_REVALIDATE}, stale-while-revalidate=${CACHE_CONFIG.STALE_WHILE_REVALIDATE}`,
      'Content-Type': 'application/json',
    },
  });
}
