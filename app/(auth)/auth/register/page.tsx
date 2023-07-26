'use client';

import Button from '@/app/components/buttons/Button';
import axios, { AxiosError } from 'axios';
import { join } from 'lodash';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import Input from '../components/Input';

const Register = () => {
  const { register, handleSubmit } = useForm();

  const submitHandler = useCallback(async (data: any) => {
    try {
      const { email, password } = data;
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        { email, password }
      );
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        toast(
          join(
            err.response?.data?.errors?.map((e: any) => e.message),
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
              name="email"
              register={register}
              type="text"
              placeholder="Nhập chính xác email của bạn"
            />
          </div>
          <div className="mt-4">
            <Input
              name="password"
              register={register}
              type="password"
              placeholder="Tạo mật khẩu (dễ nhớ chút nhé ^^)"
            />
          </div>
        </div>
        <div className="h-12 w-64 mt-8">
          <Button>
            <p className="font-bold">Tạo tài khoản</p>
          </Button>
        </div>
        <div className="mt-8">
          <span>Bạn đã có tài khoản?</span>
          <Link href="/auth/login" className="ml-2 text-cyan-600 font-bold">
            Đăng nhập ngay
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
