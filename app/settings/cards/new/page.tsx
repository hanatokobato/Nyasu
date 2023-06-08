'use client';

import { useSearchParams } from 'next/navigation';
import CardForm from '../components/CardForm';

const NewCard = () => {
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck_id');
  return deckId && <CardForm deckId={deckId} />;
};

export default NewCard;
