'use client';

import axios from 'axios';
import { sample, uniqBy } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import Question from './components/Question';
import SelectAnswer from './components/SelectAnswer';

const Review = () => {
  const [reviews, setReviews] = useState<IReview[]>();
  const [randomCards, setRandomCards] = useState<ICard[]>();
  const quizType = sample(['translate', 'fillblank']) as string;

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

  useEffect(() => {
    fetchReviews();
    fetchRandomCards();
  }, [fetchReviews, fetchRandomCards]);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      fetchRandomCards();
    }
  }, [reviews, fetchRandomCards]);

  return (
    <div className="flex bg-slate-100 h-full">
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
                        options={uniqBy(
                          [...(randomCards || []), reviews[0].card],
                          'id'
                        )}
                        quizType={quizType}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-auto w-1/4"></div>
    </div>
  );
};

export default Review;
