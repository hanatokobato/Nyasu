import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const AUTH_PATHS = ['/auth/login', '/auth/register'];
const PUBLIC_PATHS = ['/', '/auth/logout'].concat(AUTH_PATHS);

export default withAuth(
  function middleware(req) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-pathname', req.nextUrl.pathname);

    if (
      AUTH_PATHS.includes(req.nextUrl.pathname) &&
      req.nextauth.token !== null
    ) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        return PUBLIC_PATHS.includes(req.nextUrl.pathname) || token !== null;
      },
    },
  }
);
