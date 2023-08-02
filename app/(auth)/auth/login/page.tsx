'use client';

import Button from '@/app/components/buttons/Button';
import axios, { AxiosError } from 'axios';
import { join } from 'lodash';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import Input from '../components/Input';
import { signIn } from 'next-auth/react';

const Login = () => {
  const { register, handleSubmit } = useForm();

  const submitHandler = useCallback(async (data: any) => {
    try {
      const { email, password } = data;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { email, password }
      );
      const { token } = res.data;
      await signIn('credentials', { token });
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast(
          join(
            err.response?.data.errors.map((e: any) => e.message),
            '\n'
          ),
          { type: 'error' }
        );
      }
    }
  }, []);

  return (
    <div className="flex bg-slate-100 w-full h-screen justify-center">
      <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      <form
        className="w-1/2 h-screen bg-white flex flex-col justify-center items-center"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="w-7/12">
          <div>
            <Input
              type="text"
              name="email"
              register={register}
              placeholder="Nhập email tài khoản học"
            />
          </div>
          <div className="mt-4">
            <Input
              type="password"
              name="password"
              register={register}
              placeholder="Nhập chính xác mật khẩu của bạn"
            />
          </div>
        </div>
        <div className="h-12 w-64 mt-8">
          <Button>
            <p className="font-bold">Đăng nhập</p>
          </Button>
        </div>
        <div className="mt-8">
          <span>Chưa có tài khoản?</span>
          <Link href="/auth/register" className="ml-2 text-cyan-600 font-bold">
            Tạo tài khoản học mới
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
