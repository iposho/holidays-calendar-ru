import { NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';

const data = generateData();

export async function GET() {
  // Преобразование ключей объекта в массив чисел
  const years = Object.keys(data).map(Number);

  return NextResponse.json({ years, status: 200 });
}
