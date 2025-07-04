import { generateData } from '@/helpers/generateData';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { isNotCorrectMonth, isNotCorrectYear } from '@/helpers/isNotCorrect';
import { NextRequest, NextResponse } from 'next/server';
import { CACHE_CONFIG } from '@/config/cache';
import { availableYears } from '@/helpers/availableYears';

export const dynamic = 'force-static'; // Changed from 'force-dynamic'
export const revalidate = CACHE_CONFIG.DEFAULT_REVALIDATE;

const data = generateData(); // Data generation benefits from cached holiday loader

export async function generateStaticParams() {
  const years = availableYears();
  const params: { year: string; month: string }[] = [];

  years.forEach((year) => {
    for (let month = 1; month <= 12; month++) {
      params.push({
        year: year.toString(),
        month: month.toString(),
      });
    }
  });

  return params;
}

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
    // This case should ideally not be hit for statically generated params
    // but kept as a safeguard or for future dynamic additions if any.
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
