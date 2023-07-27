import '../globals.scss';
import { Quicksand } from 'next/font/google';
import Header from '../components/Header';
import 'react-toastify/dist/ReactToastify.css';
import { NextAuthProvider } from '../providers';

const quickSand = Quicksand({ subsets: ['vietnamese'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={quickSand.className}>
        <NextAuthProvider>
          <Header />
          <div className="pt-24 min-h-screen">{children}</div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
