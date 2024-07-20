import { NextRequest, NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';
import { isNotCorrectMonth, isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';

const data = generateData();

export async function generateStaticParams() {
  const years = [2023, 2024];
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

  return years.flatMap((year) => months.map((month) => ({
    year: year.toString(),
    month,
  })));
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
