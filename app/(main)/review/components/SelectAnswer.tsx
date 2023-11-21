'use client';

import { Card as ICard } from '@/types/api';
import React, { useCallback, useState, MouseEvent, useEffect } from 'react';

interface IProps {
  value?: string;
  options: ICard[];
  quizType: string;
  onSelected?: (selection: string | null) => void;
}

const SelectAnswer = ({ options, quizType, onSelected, value }: IProps) => {
  const [selected, setSelected] = useState<string | undefined>(value);

  const selectHandler = useCallback(
    (selection: string) => {
      setSelected(selection);
      if (onSelected) onSelected(selection);
    },
    [onSelected]
  );

  useEffect(() => {
    setSelected(value);
  }, [value]);

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
