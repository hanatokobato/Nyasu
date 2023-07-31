'use client';

import Image from 'next/image';
import Link from 'next/link';
import reviewImg from '../images/review.png';
import learningImg from '../images/learning.png';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useMemo, useRef, useState } from 'react';
import { useOutsideClicked } from '@/hooks/useOutsideAlerter';

const Header = () => {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useOutsideClicked(menuRef, () => setIsOpenMenu(false));

  const isLoggedIn = useMemo(() => status === 'authenticated', [status]);
  const isAdminLoggedIn = useMemo(
    () => status === 'authenticated' && session.user?.role === 'ADMIN',
    [status, session]
  );

  return (
    <header className="bg-white border-b w-full absolute top-0 h-24">
      <nav className="flex items-center justify-between h-full px-8 bg-stone-100">
        <div className="flex items-center flex-shrink-0 text-white mr-6 w-1/4">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
        </div>
        {isLoggedIn && (
          <div className="w-2/4 block flex-grow flex items-center w-auto h-full">
            <Link
              href="/"
              className={`w-1/4 flex flex-col items-center justify-center h-full ${
                pathname === '/review' || pathname === '/' ? 'bg-white' : ''
              }`}
            >
              <Image src={reviewImg} alt="" width={30} height={30} />
              Ôn tập
            </Link>
            <Link
              href="/decks"
              className={`w-1/4 flex flex-col items-center justify-center h-full ${
                pathname === '/decks' ? 'bg-white' : ''
              }`}
            >
              <Image src={learningImg} alt="" width={30} height={30} />
              Học từ mới
            </Link>
            <div className="w-1/4"></div>
          </div>
        )}
        <div className="w-1/4 flex justify-end items-center">
          {!isLoggedIn && (
            <Link href="/auth/login">
              <span className="font-bold text-2xl text-yellow-500 ml-4">
                Đăng nhập
              </span>
            </Link>
          )}
          {isLoggedIn && (
            <div ref={menuRef}>
              <div
                className="bg-menu-avatar w-14 h-14 bg-cover rounded-full border-4 border-orange-500 cursor-pointer"
                onClick={() => setIsOpenMenu((isOp) => !isOp)}
              ></div>
              {isOpenMenu && (
                <div className="absolute bg-yellow-500 z-50 right-2.5 top-24 max-w-xs w-11/12 rounded-b-2xl px-6 pb-5 text-white">
                  {isAdminLoggedIn && (
                    <Link
                      href="/settings"
                      onClick={() => setIsOpenMenu((isOp) => !isOp)}
                    >
                      <div className="bg-yellow-400 border border-yellow-600 h-14 rounded-xl mt-4 flex justify-center items-center">
                        <span>Quản lý</span>
                      </div>
                    </Link>
                  )}
                  {isLoggedIn && (
                    <Link
                      href="/auth/logout"
                      onClick={() => setIsOpenMenu((isOp) => !isOp)}
                    >
                      <div className="bg-yellow-400 border border-yellow-600 h-14 rounded-xl mt-4 flex justify-center items-center">
                        <span>Đăng xuất</span>
                      </div>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
