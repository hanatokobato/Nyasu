import { Card, GetApiV1CardsLearning200Response } from '@/types/api';
import { useState, useCallback } from 'react';
import { buildApiClient } from '../../lib/apiClient';
import { AxiosResponse } from 'axios';

const apiClient = buildApiClient();

const useCards = () => {
  const [learningCards, setLearningCards] = useState<Card[]>([]);

  const loadLearningCards = useCallback(async (deckId: string) => {
    const response: AxiosResponse<GetApiV1CardsLearning200Response> =
      await apiClient.getApiV1CardsLearning(deckId);
    setLearningCards(response.data.data?.cards);
  }, []);

  return { learningCards, loadLearningCards };
};

export { useCards };
