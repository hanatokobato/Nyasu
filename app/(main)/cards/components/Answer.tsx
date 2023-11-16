import { Card as ICard } from '@/types/api';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';

interface IProps {
  card: ICard;
  isCorrect?: boolean;
}

const Answer = ({ card, isCorrect }: IProps) => {
  const [isShowTrans, setIsShowTrans] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | undefined>(
    card?.audioUrl ? new Audio(card?.audioUrl) : undefined
  );

  const playAudio = useCallback(
    (e: any) => {
      e.stopPropagation();

      setAudio(new Audio(card.audioUrl));
    },
    [card.audioUrl]
  );

  useEffect(() => {
    if (audio) {
      audio.play();
    }
  }, [audio]);

  return (
    <div className="w-full p-0" id="ele-answer">
      <div
        className={`rounded-2xl w-full ${
          isCorrect ? 'bg-success' : 'bg-error'
        }`}
      >
        <div className="flex flex-wrap div-answer-game">
          <div className="w-5/6 mt-6 mb-6 relative">
            <div className="ml-10">
              <p
                className="text-white font-bold text-xl mb-0"
                id="answer-content-learn"
              >
                {card.fields.word}
              </p>
              <p
                className="text-white text-base mb-0"
                id="answer-phonetic-learn"
              >
                {card.fields.spelling}
              </p>
              <p
                className="text-white text-base mt-5 mb-0"
                id="answer-content-2-learn"
              >
                {card.fields.translate}
              </p>
              <p
                className="text-white text-base mt-5 mb-0"
                id="answer-en-hint-learn"
              >
                {card.fields.example.sentence}
              </p>

              {isShowTrans && (
                <p
                  className="text-white text-base mt-5 text-trans mb-0"
                  id="answer-trans-hint-learn"
                >
                  {card.fields.example.translate}
                </p>
              )}
            </div>
            <div id="cover-answer"></div>
          </div>
          <div className="w-1/6 text-center mt-6 mb-6">
            <div className="text-center">
              <button className="btn-answer-icon-error" onClick={playAudio}>
                <Image
                  alt=""
                  width={60}
                  height={60}
                  className="icon-btn-answer"
                  src="/sound.svg"
                />
              </button>
            </div>
            <div className="text-center mt-2">
              <button
                className="btn-answer-icon-error"
                onClick={() => setIsShowTrans((prev) => !prev)}
              >
                <Image
                  alt=""
                  width={60}
                  height={60}
                  className="icon-btn-answer"
                  src="/translate.svg"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Answer;
