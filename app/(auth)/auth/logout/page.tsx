'use client';

import axios from 'axios';
import React, { useCallback, useEffect } from 'react';
import { signOut } from 'next-auth/react';

const Logout = () => {
  const logoutHandler = useCallback(async () => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
      await signOut();
    } catch (err: unknown) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    logoutHandler();
  }, [logoutHandler]);

  return <></>;
};

export default Logout;
