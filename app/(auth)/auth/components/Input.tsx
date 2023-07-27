import React, { InputHTMLAttributes } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import styles from './Input.module.scss';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<FieldValues>;
  name: string;
}

const Input = (props: IProps) => {
  return (
    <input
      {...props.register(props.name)}
      {...props}
      className={`w-full h-14 border-none rounded-2xl py-2 px-4 focus:outline-none ${props.className} ${styles['input--focus']}`}
    />
  );
};

export default Input;
