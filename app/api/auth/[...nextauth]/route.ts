import axios from 'axios';
import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: { token: {} },
      async authorize(credentials, req) {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/user`,
          { headers: { Authorization: `Bearer ${credentials?.token}` } }
        );
        const currentUser = res.data.data.user;
        currentUser.auth_token = credentials?.token;

        return currentUser;
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
  },
  session: {
    maxAge: 60 * 60 * 24,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
