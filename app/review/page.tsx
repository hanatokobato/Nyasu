'use client';

import axios from 'axios';
import { cloneDeep, isEmpty, sample, uniqBy } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Question from './components/Question';
import SelectAnswer from './components/SelectAnswer';
import LearnButton from '../components/buttons/LearnButton';
import Answer from '../cards/components/Answer';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

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
  const [passedCards, setPassedCards] = useState<IPassedCard[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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
    if (selectedAnswer && !isSubmitted) setIsSubmitted(true);
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
      setIsSubmitted(false);
    }
  }, [selectedAnswer, isSubmitted]);

  const quizType = useMemo(() => {
    return sample(['translate', 'fillblank']) as string;
  }, [reviews]);

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
    const updateLearning = async () => {
      try {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/learnings`, {
          passed_cards: passedCards
            .filter((card) => card.attemptCount === 1)
            .map((card) => card.id),
          failed_cards: passedCards
            .filter((card) => card.attemptCount > 1)
            .map((card) => card.id),
        });

        router.push('/');
      } catch (e: any) {
        toast(e.message, { type: 'error' });
      }
    };

    if (reviews.length === 0 && passedCards.length > 0) {
      updateLearning();
    }
  }, [reviews, passedCards, router]);

  return (
    <div className="flex bg-slate-100 h-full">
      <ToastContainer />
      <div className="flex-auto w-1/4"></div>
      <div className="flex-auto w-2/3 bg-main-center relative">
        <div className="mt-20">
          <div className="relative">
            <div className="flex justify-center flex-wrap">
              <div className="w-9/12">
                <div className="text-center w-full">
                  <p className="font-bold text-2xl text-stone-500 mb-4">
                    Chọn từ thích hợp điền vào chỗ trống
                  </p>
                </div>
              </div>
              <div className="w-9/12">
                {reviews && reviews.length > 0 && (
                  <>
                    <Question card={reviews[0].card} quizType={quizType} />
                    <div className="mt-8">
                      <SelectAnswer
                        value={selectedAnswer}
                        options={uniqBy(
                          [...(randomCards || []), reviews[0].card],
                          'id'
                        )}
                        quizType={quizType}
                        onSelected={selectAnswerHandler}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center absolute w-full bottom-24">
          <LearnButton
            className="w-60"
            disabled={isEmpty(selectedAnswer)}
            onClick={checkAnswerHandler}
          >
            {isSubmitted ? 'TIẾP TỤC' : 'KIỂM TRA'}
          </LearnButton>
        </div>
        {isSubmitted && (
          <div className="mt-20">
            <Answer
              card={reviews[0].card}
              isCorrect={reviews[0].card.id === selectedAnswer}
            />
          </div>
        )}
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Review;
