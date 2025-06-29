import { NextResponse, NextRequest } from 'next/server';

const TOKEN = process.env.API_TOKEN;

// Проверка токена для всех запросов к /api
export function middleware(req: NextRequest) {
  if (!TOKEN) return NextResponse.next();

  const { pathname, searchParams } = new URL(req.url);

  if (!pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const token = req.headers.get('x-api-token') || searchParams.get('token');

  if (token !== TOKEN) {
    return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
