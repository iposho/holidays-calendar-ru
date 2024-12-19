import { NextRequest, NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';
import { isNotCorrectMonth, isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';

import { generateStaticParams as generateParams } from '@/utils/generateStaticParams';

const data = generateData();

export async function generateStaticParams() {
  return generateParams([2023, 2024], true);
}

export async function GET(req: NextRequest, { params }: { params: { year: string, month: string } }) {
  const { year, month } = params;

  if (isNotCorrectYear(Number(year))) {
    return NextResponse.json(getErrorMessages('year'), { status: 400 });
  } if (isNotCorrectMonth(Number(month))) {
    return NextResponse.json(getErrorMessages('month'), { status: 400 });
  }
  const monthData = data[Number(year)].months[Number(month) - 1];
  return NextResponse.json({
    year: Number(year),
    month: monthData,
    status: 200,
  });
}
