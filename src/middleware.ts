import { NextRequest, NextResponse } from 'next/server';
import { isNotCorrectYear, isNotCorrectMonth, isNotCorrectDay } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем только API запросы к календарю
  if (!pathname.startsWith('/api/calendar')) {
    return NextResponse.next();
  }

  // Парсим путь для валидации
  const pathParts = pathname.split('/').filter(Boolean);

  // /api/calendar -> ['api', 'calendar']
  // /api/calendar/2025 -> ['api', 'calendar', '2025']
  // /api/calendar/2025/01 -> ['api', 'calendar', '2025', '01']
  // /api/calendar/2025/01/05 -> ['api', 'calendar', '2025', '01', '05']

  if (pathParts.length >= 3) {
    const year = parseInt(pathParts[2], 10);

    // Валидация года
    if (Number.isNaN(year) || isNotCorrectYear(year)) {
      const error = getErrorMessages('year');
      return NextResponse.json(error, { status: error.status });
    }

    if (pathParts.length >= 4) {
      const fourthSegment = pathParts[3];

      // Проверяем, является ли четвертый сегмент "holidays"
      if (fourthSegment === 'holidays') {
        // Путь /api/calendar/{year}/holidays - валиден, продолжаем
        return NextResponse.next();
      }

      // Иначе пытаемся парсить как месяц
      const month = parseInt(fourthSegment, 10);

      // Валидация месяца
      if (Number.isNaN(month) || isNotCorrectMonth(month)) {
        const error = getErrorMessages('month');
        return NextResponse.json(error, { status: error.status });
      }

      if (pathParts.length >= 5) {
        const day = parseInt(pathParts[4], 10);

        // Валидация дня
        if (Number.isNaN(day) || isNotCorrectDay(year, month, day)) {
          const error = getErrorMessages('day');
          return NextResponse.json(error, { status: error.status });
        }
      }
    }
  }

  // Если валидация прошла успешно, продолжаем обработку запроса
  return NextResponse.next();
}

export const config = {
  matcher: '/api/calendar/:path*',
};
