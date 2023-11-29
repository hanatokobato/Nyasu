import {
  GetApiV1Decks200Response,
  DeckListItem,
  DeckDetail,
} from '../../types/api';
import { AxiosResponse } from 'axios';
import { useState, useCallback } from 'react';
import { buildApiClient } from '../../lib/apiClient';

const apiClient = buildApiClient();

interface IDeckParams {
  name: string;
  description: string;
  file: File;
}

const useDecks = () => {
  const [decks, setDecks] = useState<DeckListItem[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [deck, setDeck] = useState<DeckDetail>();

  const loadDecks = useCallback(
    async (page: number = 1, perPage: number = 10, search: string = '') => {
      const response: AxiosResponse<GetApiV1Decks200Response> =
        await apiClient.getApiV1Decks(page, perPage, search);
      setDecks(response.data.data.decks);
      setTotalPage(response.data.data.total_page);
    },
    []
  );

  const loadDeck = useCallback(async (deckId: string) => {
    const response = await apiClient.getApiV1DecksId(deckId);
    setDeck(response.data.data?.deck);
  }, []);

  const createDeck = useCallback(
    async ({ name, description, file }: IDeckParams) => {
      const response = await apiClient.postApiV1Decks(name, description, file);
      setDeck(response.data.data.deck);
    },
    []
  );

  const updateDeck = useCallback(
    async (deckId: string, { name, description, file }: IDeckParams) => {
      const response = await apiClient.putApiV1DecksId(
        deckId,
        name,
        description,
        file
      );
      setDeck(response.data.data.deck);
    },
    []
  );

  const deleteDeck = useCallback(async (deckId: string) => {
    apiClient.deleteApiV1DecksId(deckId);
  }, []);

  return {
    decks,
    totalPage,
    deck,
    loadDecks,
    loadDeck,
    createDeck,
    updateDeck,
    deleteDeck,
  };
};

export { useDecks };
