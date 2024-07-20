import { NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';

const data = generateData();

export async function GET() {
  return NextResponse.json({ years: Object.keys(data), status: 200 });
}
