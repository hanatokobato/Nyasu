'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ButtonHTMLAttributes } from 'react';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import timeImg from '../../../images/time.svg';
import warningImg from '../../../images/warning.png';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  date: Date;
}

const WaitReviewBtn = ({ date }: IProps) => {
  const router = useRouter();
  const renderer: CountdownRendererFn = ({
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      router.refresh();
    } else {
      return (
        <>
          <span>
            {hours.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
          </span>
          :&nbsp;
          <span>
            {minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
          </span>
          :&nbsp;
          <span>
            {seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })}
          </span>
        </>
      );
    }
  };

  return (
    <button className="w-64 bg-zinc-300 text-zinc-500 font-bold px-12 rounded-full h-12 relative">
      <Image
        src={timeImg}
        width={30}
        height={30}
        alt=""
        className="inline-block"
      />
      <span className="font-bold pl-2 text-black">
        <Countdown date={date} renderer={renderer} />
      </span>
      <div className="absolute right-1 -top-2.5">
        <Image src={warningImg} width={20} height={20} alt="" />
      </div>
    </button>
  );
};

export default WaitReviewBtn;
