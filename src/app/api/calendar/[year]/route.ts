import { NextRequest, NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';
import { isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';

const data = generateData();

export async function generateStaticParams() {
  const years = [2023, 2024];
  return years.map((year) => ({ year: year.toString() }));
}

export async function GET(req: NextRequest, { params }: { params: { year: string } }) {
  const { year } = params;

  if (isNotCorrectYear(Number(year))) {
    return NextResponse.json(getErrorMessages('year'), { status: 400 });
  }
  return NextResponse.json({
    year: Number(year),
    months: data[Number(year)].months,
    status: 200,
  });
}
