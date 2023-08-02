import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User;
  }

  interface User {
    role: 'ADMIN' | 'USER';
    auth_token: string;
  }
}
