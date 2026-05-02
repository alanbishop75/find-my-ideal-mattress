import { NextRequest, NextResponse } from 'next/server';

async function sha256hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Keep login route public.
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const cookieToken = request.cookies.get('fmi_admin')?.value;

  // Fail closed if auth is not configured.
  if (!adminPassword) {
    if (pathname.startsWith('/api/admin/')) {
      return NextResponse.json({ error: 'Admin auth is not configured.' }, { status: 500 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const expectedToken = await sha256hex(adminPassword);
  const isAuthed = Boolean(cookieToken) && cookieToken === expectedToken;

  if (isAuthed) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
