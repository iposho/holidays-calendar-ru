import { NextRequest, NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';
import { isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { availableYears } from '@/helpers/availableYears';

const data = generateData();

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

  return NextResponse.json({
    year: Number(year),
    months: data[Number(year)].months,
    status: 200,
  });
}
