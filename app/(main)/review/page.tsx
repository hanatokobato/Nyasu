'use client';

import axios from 'axios';
import { cloneDeep, isEmpty, sample, set, uniqBy } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  ChangeEvent,
  useRef,
} from 'react';
import Question from './components/Question';
import SelectAnswer from './components/SelectAnswer';
import LearnButton from '../../components/buttons/Button';
import Answer from '../cards/components/Answer';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import GameInput from '@/app/components/inputs/TextInput';
import FillBlankInput from '@/app/components/inputs/FillBlankInput';

interface IPassedCard {
  id: string;
  attemptCount: number;
}

interface IReviewReviewing extends IReview {
  attemptCount: number;
}

const Review = () => {
  const router = useRouter();
  const [reviews, setReviews] = useState<IReviewReviewing[]>([]);
  const [randomCards, setRandomCards] = useState<ICard[]>();
  const [selectedAnswer, setSelectedAnswer] = useState<string>();
  const [answerText, setAnswerText] = useState<string>();
  const [passedCards, setPassedCards] = useState<IPassedCard[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const submitBtnRef = useRef<HTMLDivElement>(null);

  const fetchReviews = useCallback(async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/learnings/reviews`
    );
    const { reviews } = res.data;
    setReviews(reviews);
  }, []);

  const fetchRandomCards = useCallback(async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/cards/random`
    );
    const { cards } = res.data;
    setRandomCards(cards.map((card: any) => ({ ...card, id: card._id })));
  }, []);

  const selectAnswerHandler = useCallback((selected: string | null) => {
    if (selected) setSelectedAnswer(selected);
  }, []);

  const checkAnswerHandler = useCallback(() => {
    if (selectedAnswer && !isSubmitted) {
      setIsSubmitted(true);
    }
    if (selectedAnswer && isSubmitted) {
      setReviews((curr) => {
        const currentReviews = cloneDeep(curr);
        const firstReview = currentReviews.shift() as IReviewReviewing;
        firstReview.attemptCount = (firstReview.attemptCount ?? 0) + 1;
        if (firstReview.card.id === selectedAnswer) {
          setPassedCards((currPassed) =>
            currPassed.concat({
              id: firstReview.card.id,
              attemptCount: firstReview.attemptCount,
            })
          );
        } else {
          currentReviews.push(firstReview);
        }

        return currentReviews;
      });
      setSelectedAnswer(undefined);
      setAnswerText('');
      setIsSubmitted(false);
    }
  }, [selectedAnswer, isSubmitted]);

  const quizType = useMemo(() => {
    if (reviews.length > 0) {
      return sample([
        'translate',
        'fillblank',
        'freeinput',
        'fillinput',
      ]) as string;
    }
  }, [reviews]);

  const updateLearning = useCallback(async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/learnings`, {
        passed_cards: passedCards
          .filter((card) => card.attemptCount === 1)
          .map((card) => card.id),
        failed_cards: passedCards
          .filter((card) => card.attemptCount > 1)
          .map((card) => card.id)
          .concat(reviews.map((r) => r.card.id)),
      });

      router.prefetch('/');
      router.push('/');
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, [passedCards, reviews, router]);

  useEffect(() => {
    if (isSubmitted) {
      submitBtnRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isSubmitted]);

  useEffect(() => {
    fetchReviews();
    fetchRandomCards();
  }, [fetchReviews, fetchRandomCards]);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      fetchRandomCards();
    }
  }, [reviews, fetchRandomCards]);

  useEffect(() => {
    if (
      (reviews.length === 0 && passedCards.length > 0) ||
      reviews.some((r) => r.attemptCount > 3)
    ) {
      updateLearning();
    }
  }, [updateLearning, passedCards.length, reviews]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (passedCards.length > 0) updateLearning();

      router.prefetch('/');
      router.push('/');
    }, 1000 * 60 * 10);

    return clearTimeout(timer);
  }, []);

  return (
    <div className="flex bg-slate-100 min-h-full-minus-header">
      <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-2/3 bg-main-center relative">
        <div className="mt-20">
          <div className="relative">
            <div className="flex justify-center flex-wrap">
              <div className="w-9/12">
                {reviews && reviews.length > 0 && (
                  <>
                    <Question
                      card={reviews[0].card}
                      quizType={quizType ?? ''}
                    />
                    <div className="mt-8">
                      {quizType &&
                        ['translate', 'fillblank'].includes(quizType) && (
                          <SelectAnswer
                            value={selectedAnswer}
                            options={uniqBy(
                              [...(randomCards || []), reviews[0].card],
                              'id'
                            )}
                            quizType={quizType ?? ''}
                            onSelected={selectAnswerHandler}
                          />
                        )}
                      {quizType === 'freeinput' && (
                        <GameInput
                          value={answerText}
                          placeholder="Gõ lại từ bạn đã nghe được"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            selectAnswerHandler(
                              e.target.value === reviews[0].card.fields.word
                                ? reviews[0].card.id
                                : '_'
                            );
                            setAnswerText(e.target.value);
                          }}
                          onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>
                          ) => {
                            if (e.key === 'Enter') {
                              checkAnswerHandler();
                            }
                          }}
                          autoFocus
                        />
                      )}
                      {quizType === 'fillinput' && (
                        <FillBlankInput
                          value={answerText ?? ''}
                          numOfChars={reviews[0].card.fields.word.length}
                          onChange={(val) => {
                            selectAnswerHandler(
                              val.join('') === reviews[0].card.fields.word
                                ? reviews[0].card.id
                                : '_'
                            );
                            setAnswerText(val.join(''));
                          }}
                          onSubmit={checkAnswerHandler}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between w-full mt-10">
          {isSubmitted && (
            <div>
              <Answer
                card={reviews[0].card}
                isCorrect={reviews[0].card.id === selectedAnswer}
              />
            </div>
          )}
          <LearnButton
            ref={submitBtnRef}
            className="w-60 my-10"
            disabled={isEmpty(selectedAnswer)}
            onClick={checkAnswerHandler}
          >
            {isSubmitted ? 'TIẾP TỤC' : 'KIỂM TRA'}
          </LearnButton>
        </div>
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Review;
