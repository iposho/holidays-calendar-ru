import { NextRequest, NextResponse } from 'next/server';
import { isNotCorrectDay, isNotCorrectMonth, isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { isWorkingDay } from '@/helpers/isWorkingDay';
import { CACHE_CONFIG } from '@/config/cache';
import { availableYears } from '@/helpers/availableYears';
import { getDaysCount } from '@/helpers/getDaysCount';

export const dynamic = 'force-static'; // Added to enable static generation
export const revalidate = CACHE_CONFIG.DEFAULT_REVALIDATE;

export async function generateStaticParams() {
  const years = availableYears();
  const params: { year: string; month: string; day: string }[] = [];

  years.forEach((year) => {
    for (let month = 1; month <= 12; month++) {
      const daysInMonth = getDaysCount(year, month);
      for (let day = 1; day <= daysInMonth; day++) {
        params.push({
          year: year.toString(),
          month: month.toString(),
          day: day.toString(),
        });
      }
    }
  });

  return params;
}

export async function GET(req: NextRequest, { params }: { params: { year: string, month: string, day: string } }) {
  const { year, month, day } = params;

  // Validations are still useful for safeguarding, though less critical for statically generated paths
  if (isNotCorrectYear(Number(year))) {
    const error = getErrorMessages('year');
    return NextResponse.json(error, { status: error.status });
  }
  if (isNotCorrectMonth(Number(month))) {
    const error = getErrorMessages('month');
    return NextResponse.json(error, { status: error.status });
  }
  if (isNotCorrectDay(Number(year), Number(month), Number(day))) {
    const error = getErrorMessages('day');
    return NextResponse.json(error, { status: error.status });
  }

  // isWorkingDay benefits from the cached holiday data
  const dayData = isWorkingDay(Number(year), Number(month), Number(day));

  if (!dayData) {
    // This should ideally not be hit for statically generated valid paths
    const error = getErrorMessages('not_found');
    return NextResponse.json(error, { status: error.status });
  }

  return new NextResponse(JSON.stringify({
    year: Number(year),
    month: {
      name: dayData.month.name,
      id: dayData.month.id,
    },
    date: dayData.date.toISOString(),
    isWorkingDay: dayData.isWorkingDay,
    isShortDay: dayData.isShortDay,
    holiday: dayData.holiday,
    status: 200,
  }), {
    status: 200,
    headers: {
      'Cache-Control': `public, s-maxage=${CACHE_CONFIG.DEFAULT_REVALIDATE}, stale-while-revalidate=${CACHE_CONFIG.STALE_WHILE_REVALIDATE}`,
      'Content-Type': 'application/json',
    },
  });
}
