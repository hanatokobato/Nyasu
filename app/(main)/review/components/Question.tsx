import Image from 'next/image';
import React, { useCallback, useEffect } from 'react';
import styles from './Question.module.scss';

interface IProps {
  card: ICard;
  quizType: string;
}

const Question = ({ card, quizType }: IProps) => {
  const playAudio = useCallback(
    (e: any) => {
      e.stopPropagation();

      new Audio(card.audioUrl).play();
    },
    [card.audioUrl]
  );

  let question: JSX.Element | string = '';
  let replaceText;
  switch (quizType) {
    case 'translate':
      replaceText = `<span class="border-black border-b">${card.fields.word}</span>`;
      question = card.fields.example.sentence.replace(
        /\*\*.*?\*\*/g,
        replaceText
      );
      break;
    case 'fillblank':
      replaceText = '______';
      question = card.fields.example.sentence.replace(
        /\*\*.*?\*\*/g,
        replaceText
      );
      break;
    case 'freeinput':
      question = (
        <button className="relative w-14 h-14 bg-neutral-200 rounded-full">
          <Image
            src="/sound.svg"
            alt="sound"
            width={59}
            height={59}
            className="cursor-pointer rounded-full bg-white absolute left-0 bottom-1.5 active:translate-y-1.5 focus:translate-y-1.5"
            onClick={playAudio}
          />
        </button>
      );
      break;
    case 'fillinput':
      question = <span className="font-bold">{card.fields.translate}</span>;
      break;
  }

  useEffect(() => {
    if (quizType === 'freeinput') {
      new Audio(card.audioUrl).play();
    }
  }, [quizType, card.audioUrl]);

  return (
    <>
      {['translate', 'fillblank'].includes(quizType) && (
        <div className="text-center w-full">
          <p className="font-bold text-2xl text-stone-500 mb-4">
            Chọn từ thích hợp điền vào chỗ trống
          </p>
        </div>
      )}
      {['translate', 'fillblank'].includes(quizType) && (
        <div className={`rounded-3xl p-1.5 ${styles['box-question']}`}>
          <div className="text-center bg-white px-6 py-4 rounded-2xl">
            <p
              className="font-bold"
              dangerouslySetInnerHTML={{ __html: question }}
            ></p>
          </div>
        </div>
      )}
      {['freeinput', 'fillinput'].includes(quizType) && (
        <div className="text-center">{question}</div>
      )}
    </>
  );
};

export default Question;
