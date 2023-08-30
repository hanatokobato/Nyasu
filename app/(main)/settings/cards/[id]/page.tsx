import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import CardForm from '../components/CardForm';

const getData = async (cardId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/cards/${cardId}`,
    { headers: { Authorization: `Bearer ${session.user.auth_token}` } }
  );
  const card = res.data.card;
  return card;
};

const Card = async ({ params }: { params: { id: string } }) => {
  const card = await getData(params.id);

  return <CardForm card={card} deckId={card.deck_id} />;
};

export default Card;
