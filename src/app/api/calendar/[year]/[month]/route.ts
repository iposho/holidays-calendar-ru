import { generateData } from '@/helpers/generateData';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { isNotCorrectMonth, isNotCorrectYear } from '@/helpers/isNotCorrect';
import { NextRequest, NextResponse } from 'next/server';
import { CACHE_CONFIG } from '@/config/cache';

const data = generateData();

export async function GET(req: NextRequest, { params }: { params: { year: string; month: string } }) {
  const { year, month } = params;

  if (isNotCorrectYear(Number(year))) {
    const error = getErrorMessages('year');
    return NextResponse.json(error, { status: error.status });
  }
  if (isNotCorrectMonth(Number(month))) {
    const error = getErrorMessages('month');
    return NextResponse.json(error, { status: error.status });
  }

  const monthData = data[Number(year)]?.months[Number(month) - 1];

  if (!monthData) {
    const error = getErrorMessages('not_found');
    return NextResponse.json(error, { status: error.status });
  }

  return new NextResponse(JSON.stringify({
    year: Number(year),
    month: monthData,
    status: 200,
  }), {
    status: 200,
    headers: {
      'Cache-Control': `public, s-maxage=${CACHE_CONFIG.DEFAULT_REVALIDATE}, stale-while-revalidate=${CACHE_CONFIG.STALE_WHILE_REVALIDATE}`,
      'Content-Type': 'application/json',
    },
  });
}
