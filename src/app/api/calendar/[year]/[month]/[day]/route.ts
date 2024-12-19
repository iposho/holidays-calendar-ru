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
    return NextResponse.json(getErrorMessages('year'), { status: 400 });
  } if (isNotCorrectMonth(Number(month))) {
    return NextResponse.json(getErrorMessages('month'), { status: 400 });
  } if (isNotCorrectDay(Number(year), Number(month), Number(day))) {
    return NextResponse.json(getErrorMessages('day'), { status: 400 });
  }
  const dayData = isWorkingDay(Number(year), Number(month), Number(day));
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
