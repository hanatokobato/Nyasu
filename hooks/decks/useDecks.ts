import {
  GetApiV1Decks200Response,
  DeckListItem,
  DeckDetail,
} from '../../types/api';
import { AxiosResponse } from 'axios';
import { useState, useCallback } from 'react';
import { buildApiClient } from '../../lib/apiClient';

const apiClient = buildApiClient();

const useDecks = () => {
  const [decks, setDecks] = useState<DeckListItem[]>([]);
  const [deck, setDeck] = useState<DeckDetail>();

  const loadDecks = useCallback(
    async (page: number = 1, perPage: number = 10, search: string = '') => {
      const response: AxiosResponse<GetApiV1Decks200Response> =
        await apiClient.getApiV1Decks(page, perPage, search);
      setDecks(response.data.data.decks);
    },
    []
  );

  const loadDeck = useCallback(async (deckId: string) => {
    const response = await apiClient.getApiV1DecksId(deckId);
    setDeck(response.data.data?.deck);
  }, []);

  return { decks, deck, loadDecks, loadDeck };
};

export { useDecks };
