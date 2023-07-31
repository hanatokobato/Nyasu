import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const AUTH_PATHS = ['/auth/login', '/auth/register'];
const PUBLIC_PATHS = ['/', '/auth/logout'].concat(AUTH_PATHS);
const ADMIN_PATHS = ['/settings'];

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
        if (PUBLIC_PATHS.includes(req.nextUrl.pathname)) return true;

        if (ADMIN_PATHS.some((p) => req.nextUrl.pathname.startsWith(p))) {
          return token !== null && (token.user as IUser).role === 'ADMIN';
        }

        return token !== null;
      },
    },
  }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|favicon.ico).*)'],
};
