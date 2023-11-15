import { GetApiV1Decks200Response, DeckListItem } from '../../types/api';
import { AxiosResponse } from 'axios';
import { useState, useCallback } from 'react';
import { buildApiClient } from '../../lib/apiClient';

const apiClient = buildApiClient();

const useDecks = () => {
  const [decks, setDecks] = useState<DeckListItem[]>([]);

  const loadDecks = useCallback(
    async (page: number = 1, perPage: number = 10, search: string = '') => {
      const response: AxiosResponse<GetApiV1Decks200Response> =
        await apiClient.getApiV1Decks(page, perPage, search);
      setDecks(response.data.data.decks);
    },
    []
  );

  return { decks, loadDecks };
};

export { useDecks };
