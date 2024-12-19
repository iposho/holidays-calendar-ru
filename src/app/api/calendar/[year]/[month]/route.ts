import { generateData } from '@/helpers/generateData';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { isNotCorrectMonth, isNotCorrectYear } from '@/helpers/isNotCorrect';
import { NextRequest, NextResponse } from 'next/server';

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

  return NextResponse.json({
    year: Number(year),
    month: monthData,
    status: 200,
  });
}
