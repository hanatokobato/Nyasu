import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      role: 'ADMIN' | 'USER';
    };
  }

  interface User {
    role: 'ADMIN' | 'USER';
  }
}
