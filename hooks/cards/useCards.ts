import {
  Card,
  GetApiV1Cards200Response,
  GetApiV1CardsLearning200Response,
} from '@/types/api';
import { useState, useCallback } from 'react';
import { buildApiClient } from '../../lib/apiClient';
import { AxiosResponse } from 'axios';

const apiClient = buildApiClient();

const useCards = () => {
  const [learningCards, setLearningCards] = useState<Card[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const loadLearningCards = useCallback(async (deckId: string) => {
    const response: AxiosResponse<GetApiV1CardsLearning200Response> =
      await apiClient.getApiV1CardsLearning(deckId);
    setLearningCards(response.data.data?.cards);
  }, []);

  const loadCards = useCallback(
    async ({
      page = 1,
      perPage = 10,
      deckId,
    }: {
      page?: number;
      perPage?: number;
      deckId?: string;
    }) => {
      const response: AxiosResponse<GetApiV1Cards200Response> =
        await apiClient.getApiV1Cards(page, perPage, deckId);
      setCards((currentCards) =>
        currentCards.concat(response.data.data?.cards ?? [])
      );
      setCurrentPage(response.data.data?.page ?? 1);
      setTotalPage(response.data.data?.total_page ?? 1);
    },
    []
  );

  const deleteCard = useCallback(async (id: string) => {
    await apiClient.deleteApiV1CardsId(id);
    setCards((currentCards) => currentCards.filter((c) => c.id !== id));
  }, []);

  return {
    learningCards,
    loadLearningCards,
    cards,
    currentPage,
    totalPage,
    loadCards,
    deleteCard,
  };
};

export { useCards };
