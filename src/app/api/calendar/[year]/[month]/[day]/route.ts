import { NextRequest, NextResponse } from 'next/server';
import { isNotCorrectDay, isNotCorrectMonth, isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { isWorkingDay } from '@/helpers/isWorkingDay';

import { generateStaticParams as generateParams } from '@/utils/generateStaticParams';

export async function generateStaticParams() {
  return generateParams([2023, 2024], true, true);
}

export async function GET(req: NextRequest, { params }: { params: { year: string, month: string, day: string } }) {
  const { year, month, day } = params;

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

  const dayData = isWorkingDay(Number(year), Number(month), Number(day));

  if (!dayData) {
    const error = getErrorMessages('not_found');
    return NextResponse.json(error, { status: error.status });
  }

  return NextResponse.json({
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
  });
}
