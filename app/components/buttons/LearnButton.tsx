import React, { ButtonHTMLAttributes } from 'react';

const LearnButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <div
      className={`relative h-12 bg-lime-700 rounded-full mx-auto ${props.className}`}
    >
      <button
        {...props}
        className={`absolute left-0 h-12 ${
          props.disabled
            ? 'bg-zinc-300 text-zinc-500 font-bold'
            : 'bg-lime-500 -top-1.5 text-white'
        } rounded-full px-10 w-full text-xl active:top-0`}
      >
        {props.children}
      </button>
    </div>
  );
};

export default LearnButton;
