import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('Referrer-Policy', 'no-referrer-when-downgrade');

  return NextResponse.next({
    headers: requestHeaders,
  });
}
