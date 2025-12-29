import { NextRequest, NextResponse } from 'next/server';
import { isNotCorrectYear, isNotCorrectMonth, isNotCorrectDay } from '@/helpers/isNotCorrect';
import { getErrorMessages } from '@/helpers/getErrorMessages';

const isDevelopment = process.env.NODE_ENV === 'development';

const SECURITY_HEADERS: Record<string, string> = {
  'X-DNS-Prefetch-Control': 'on',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer-when-downgrade',
  'Content-Security-Policy': [
    'default-src \'self\'',
    `script-src 'self' 'unsafe-inline' ${isDevelopment ? '\'unsafe-eval\'' : ''} https://mc.yandex.ru`,
    'style-src \'self\' \'unsafe-inline\'',
    'img-src \'self\' data: https://vercelbadge.vercel.app https://mc.yandex.ru',
    'connect-src \'self\' https://mc.yandex.ru',
    'frame-ancestors \'none\'',
    'base-uri \'self\'',
    'form-action \'self\'',
  ].join('; '),
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

function withSecurityHeaders(res: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Для всех маршрутов добавляем security headers
  // Дополнительно валидируем только API-запросы к календарю
  if (!pathname.startsWith('/api/calendar')) {
    return withSecurityHeaders(NextResponse.next());
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
      return withSecurityHeaders(NextResponse.json(error, { status: error.status }));
    }

    if (pathParts.length >= 4) {
      const fourthSegment = pathParts[3];

      // Проверяем, является ли четвертый сегмент "holidays" или "ics"
      if (fourthSegment === 'holidays' || fourthSegment === 'ics') {
        // Путь /api/calendar/{year}/holidays или /api/calendar/{year}/ics - валиден, продолжаем
        return withSecurityHeaders(NextResponse.next());
      }

      // Иначе пытаемся парсить как месяц
      const month = parseInt(fourthSegment, 10);

      // Валидация месяца
      if (Number.isNaN(month) || isNotCorrectMonth(month)) {
        const error = getErrorMessages('month');
        return withSecurityHeaders(NextResponse.json(error, { status: error.status }));
      }

      if (pathParts.length >= 5) {
        const day = parseInt(pathParts[4], 10);

        // Валидация дня
        if (Number.isNaN(day) || isNotCorrectDay(year, month, day)) {
          const error = getErrorMessages('day');
          return withSecurityHeaders(NextResponse.json(error, { status: error.status }));
        }
      }
    }
  }

  // Если валидация прошла успешно, продолжаем обработку запроса
  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  // Применяем middleware ко всем маршрутам, чтобы добавить security headers,
  // но логика валидации выполнится только для /api/calendar/*
  matcher: '/:path*',
};
