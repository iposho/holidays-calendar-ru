import { NextResponse } from 'next/server';
import { generateData } from '@/helpers/generateData';
import { CACHE_CONTROL } from '@/config/cache';

const data = generateData();

export async function GET() {
  // Преобразование ключей объекта в массив чисел
  const years = Object.keys(data).map(Number);

  return new NextResponse(JSON.stringify({ years, status: 200 }), {
    status: 200,
    headers: {
      'Cache-Control': CACHE_CONTROL,
      'Content-Type': 'application/json',
    },
  });
}
