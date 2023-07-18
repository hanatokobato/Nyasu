'use client';

import DropDownMenu from '@/app/components/DropDownMenu';
import MDEditor from '@uiw/react-md-editor';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AiFillFileAdd, AiFillDelete } from 'react-icons/ai';
import { TfiMoreAlt } from 'react-icons/tfi';
import { toast, ToastContainer } from 'react-toastify';

const Cards = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deck_id');
  const [cards, setCards] = useState<ICard[]>([]);
  const [deck, setDeck] = useState<IDeck>();
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean | string>(false);

  const fetchDeck = useCallback(async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/decks/${deckId}`
    );
    const deck = res.data.deck;
    return deck;
  }, [deckId]);

  const fetchCards = useCallback(
    async (page: number = 1, perPage: number = 10): Promise<ICard[]> => {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/cards`,
        {
          params: {
            page,
            per_page: perPage,
            deck_id: deckId,
          },
        }
      );
      const fetchedCards = response.data.cards.map((card: any) => ({
        id: card._id,
        deckId: card.deck_id,
        content: card.content,
        audioUrl: card.audioUrl,
      }));
      setIsLoading(false);

      return fetchedCards;
    },
    [deckId]
  );

  const deleteCard = useCallback(async (id: string) => {
    try {
      if (confirm('Want to delete?') === true) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/cards/${id}`);
        setCards((currentCards) => currentCards.filter((c) => c.id !== id));
        toast('Deck deleted!', { type: 'success' });
      }
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, []);

  const initData = useCallback(async () => {
    const [fetchedDeck, initCards] = await Promise.all([
      fetchDeck(),
      fetchCards(),
    ]);
    setDeck(fetchedDeck);
    setCards(initCards);
  }, [fetchCards, fetchDeck]);

  const playAudio = useCallback((card: ICard) => {
    setAudio(new Audio(card?.audioUrl));
  }, []);

  useEffect(() => {
    initData();
  }, [initData]);

  useEffect(() => {
    if (audio) {
      audio.play();
    }
  }, [audio]);

  return (
    <>
      <ToastContainer />
      <div className="mb-8">
        <div className="flex justify-between p-4 m-auto bg-white rounded-lg shadow w-96">
          <div>
            <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-white bg-yellow-300">
              {deck?.name}
            </span>
          </div>

          <button
            type="button"
            className="py-2 px-4 flex justify-center items-center  bg-green-500 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-full"
            onClick={() => router.push(`settings/cards/new?deck_id=${deckId}`)}
          >
            <div className="flex items-center justify-center">
              <AiFillFileAdd />
              <span className="ml-2">Add card</span>
            </div>
          </button>
        </div>
      </div>

      <div className="container flex flex-col items-center justify-center w-full mx-auto">
        <ul className="flex flex-wrap">
          {cards.map((card) => (
            <li
              key={card.id}
              className="flex flex-col ml-4 mb-4 border-gray-400 w-60"
            >
              {card.audioUrl && (
                <button className="relative w-14 h-14 bg-neutral-200 rounded-full">
                  <Image
                    src="/sound.svg"
                    alt="sound"
                    width={59}
                    height={59}
                    className="cursor-pointer rounded-full bg-white absolute left-0 bottom-1.5 active:translate-y-1.5 focus:translate-y-1.5"
                    onClick={() => playAudio(card)}
                  />
                </button>
              )}
              <div className="flex justify-end">
                <DropDownMenu
                  items={[
                    {
                      label: 'Delete',
                      icon: <AiFillDelete color="#CC0000" />,
                      clickHandler: () => deleteCard(card.id),
                    },
                  ]}
                  icon={<TfiMoreAlt />}
                />
              </div>
              <div className="shadow border select-none cursor-pointer bg-white dark:bg-gray-800 rounded-md flex flex-1 items-center p-4">
                <Link
                  href={`/settings/cards/${card.id}`}
                  className="w-full h-full"
                >
                  <MDEditor.Markdown source={card.content.front} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Cards;
