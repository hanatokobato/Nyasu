'use client';

import axios from 'axios';
import { SessionProvider } from 'next-auth/react';

axios.defaults.withCredentials = true;

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return <SessionProvider>{children}</SessionProvider>;
};
