import DeckForm from '../components/DeckForm';
import axios from 'axios';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const getData = async (deckId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) return [];
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/decks/${deckId}`,
    { headers: { Authorization: `Bearer ${session.user.auth_token}` } }
  );
  const deck = res.data.deck;
  return deck;
};

const Deck = async ({ params }: { params: { id: string } }) => {
  const deck = await getData(params.id);
  return <DeckForm deck={deck} />;
};

export default Deck;
