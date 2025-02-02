import { NextRequest, NextResponse } from 'next/server';
import { isNotCorrectYear } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';
import { CACHE_CONFIG } from '@/config/cache';
import { generateStaticParams as generateParams } from '@/utils/generateStaticParams';
import { generateICSContent } from '@/utils/generateICSContent';

export const dynamic = 'force-static';
export const revalidate = CACHE_CONFIG.DEFAULT_REVALIDATE * 2;

export async function generateStaticParams() {
  return generateParams([2023, 2024, 2025]);
}

export async function GET(req: NextRequest, { params }: { params: { year: string } }) {
  const { year } = params;

  if (isNotCorrectYear(Number(year))) {
    const error = getErrorMessages('year');
    return NextResponse.json(error, { status: error.status });
  }

  const icsContent = generateICSContent(Number(year));

  return new NextResponse(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="holidays-${year}.ics"`,
      'Cache-Control': [
        'public',
        'immutable',
        `s-maxage=${CACHE_CONFIG.DEFAULT_REVALIDATE * 2}`,
        `stale-while-revalidate=${CACHE_CONFIG.STALE_WHILE_REVALIDATE * 2}`,
      ].join(', '),
    },
  });
}
