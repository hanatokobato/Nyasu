import React from 'react';
import styles from './Question.module.scss';

interface IProps {
  card: ICard;
  quizType: string;
}

const Question = ({ card, quizType }: IProps) => {
  let replaceText = '______';
  switch (quizType) {
    case 'translate':
      replaceText = `<span class="border-black border-b">${card.fields.word}</span>`;
      break;
    case 'fillblank':
      replaceText = '______';
      break;
  }
  const question = card.fields.example.sentence.replace(
    /\*\*.*?\*\*/g,
    replaceText
  );

  return (
    <div className={`rounded-3xl p-1.5 ${styles['box-question']}`}>
      <div className="text-center bg-white px-6 py-4 rounded-2xl">
        <p
          className="font-bold"
          dangerouslySetInnerHTML={{ __html: question }}
        ></p>
      </div>
    </div>
  );
};

export default Question;
