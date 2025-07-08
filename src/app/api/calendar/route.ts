import { NextResponse } from 'next/server';
import { availableYears } from '@/helpers/availableYears';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  const years = availableYears();
  return NextResponse.json({ years, status: 200 });
}
