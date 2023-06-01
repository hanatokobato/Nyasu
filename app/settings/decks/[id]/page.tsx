import DeckForm from '../components/DeckForm';
import axios from 'axios';
import React from 'react';
import { NextPage } from 'next';

const getData = async (deckId: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/decks/${deckId}`
  );
  const deck = res.data.deck;
  return deck;
};

const Deck = async ({ params }: { params: { id: string } }) => {
  const deck = await getData(params.id);
  return <DeckForm deck={deck} />;
};

export default Deck;
