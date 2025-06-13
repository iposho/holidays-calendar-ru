import { NextRequest, NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';
import { isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { availableYears } from '@/helpers/availableYears';
import { CACHE_CONTROL } from '@/config/cache';

const data = generateData();

export const dynamic = 'force-static';
export const revalidate = 15552000; // 180 дней

export async function generateStaticParams() {
  const years = availableYears();
  return years.map((year) => ({ year: year.toString() }));
}

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

  return new NextResponse(JSON.stringify({
    year: Number(year),
    months: data[Number(year)].months,
    status: 200,
  }), {
    status: 200,
    headers: {
      'Cache-Control': CACHE_CONTROL,
      'Content-Type': 'application/json',
    },
  });
}
