import { NextRequest, NextResponse } from 'next/server';
import { isNotCorrectDay, isNotCorrectMonth, isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { isWorkingDay } from '@/helpers/isWorkingDay';

export async function generateStaticParams() {
  const years = [2023, 2024];
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  return years.flatMap((year) => months.flatMap((month) => days.map((day) => ({
    year: year.toString(),
    month,
    day,
  }))));
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
    holiday: dayData.holiday,
    status: 200,
  });
}
