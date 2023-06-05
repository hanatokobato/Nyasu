import axios from 'axios';
import CardForm from '../components/CardForm';

const getData = async (cardId: string) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`
  );
  const card = res.data.card;
  return card;
};

const Card = async ({ params }: { params: { id: string } }) => {
  const card = await getData(params.id);

  return <CardForm card={card} deckId={card.deck_id} />;
};

export default Card;
