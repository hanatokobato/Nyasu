import DeckForm from '../components/DeckForm';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import { buildApiClient } from '@/lib/apiClient';
import { DeckDetail } from '@/types/api';

const apiClient = buildApiClient();

const getData = async (deckId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  const response = await apiClient.getApiV1DecksId(deckId, {
    headers: { Authorization: `Bearer ${session.user.auth_token}` },
  });
  const deck = response.data.data.deck;
  return deck;
};

const Deck = async ({ params }: { params: { id: string } }) => {
  const deck = await getData(params.id) as DeckDetail;
  return <DeckForm deck={deck} />;
};

export default Deck;
