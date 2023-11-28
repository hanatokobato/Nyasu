import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import CardForm from '../components/CardForm';
import { buildApiClient } from '../../../../../lib/apiClient';

const apiClient = buildApiClient();

const getData = async (cardId: string) => {
  const session = await getServerSession(authOptions);
  if (!session) return undefined;

  const response = await apiClient.getApiV1CardsId(cardId, {
    headers: { Authorization: `Bearer ${session.user.auth_token}` },
  });

  const card = response.data.data.card;
  return card;
};

const Card = async ({ params }: { params: { id: string } }) => {
  const card = await getData(params.id);

  return <CardForm card={card} deckId={card?.deck_id} />;
};

export default Card;
