'use client';

import React, { useCallback, useState, MouseEvent } from 'react';

interface IProps {
  options: ICard[];
  quizType: string;
  onSelected?: (selection: string | null) => void;
}

const SelectAnswer = ({ options, quizType, onSelected }: IProps) => {
  const [selected, setSelected] = useState<string | null>();

  const selectHandler = useCallback(
    (selection: string) => {
      setSelected(selection);
      if (onSelected) onSelected(selection);
    },
    [onSelected]
  );

  return (
    <div>
      {options.map((card, i) => (
        <div
          key={i}
          className={`${
            selected === card.id ? 'bg-white' : 'bg-zinc-200'
          } mt-5 rounded-2xl`}
        >
          <div
            className={`cursor-pointer rounded-2xl ${
              selected === card.id ? 'bg-success' : 'bg-white'
            } p-4 text-center relative -top-1.5 active:top-0`}
            onClick={() => selectHandler(card.id)}
          >
            <p className={`${selected === card.id ? 'text-white' : ''}`}>
              {quizType === 'translate'
                ? card.fields.translate
                : card.fields.word}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectAnswer;
