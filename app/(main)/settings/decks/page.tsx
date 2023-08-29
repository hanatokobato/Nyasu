'use client';

import axios from 'axios';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsSearch } from 'react-icons/bs';
import { GiCardRandom } from 'react-icons/gi';
import Pagination from '@/app/components/Pagination';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ISearchInput {
  search: string;
}

const SettingsDecks = () => {
  const router = useRouter();
  const [decks, setDecks] = useState<IDeck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const {
    register: searchRegister,
    handleSubmit: handleSearch,
    getValues: getSearchValues,
  } = useForm<ISearchInput>();

  const fetchDecks = useCallback(
    async (
      page: number = 1,
      perPage: number = 10,
      search: string = ''
    ): Promise<IDeck[]> => {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/decks`,
        {
          params: {
            page,
            per_page: perPage,
            search: search,
          },
        }
      );
      const fetchedDecks = response.data.decks.map((deck: any) => ({
        id: deck._id,
        name: deck.name,
        description: deck.description,
        photoUrl: deck.photoUrl,
        createdAt: deck.createdAt,
      }));
      setPageCount(response.data.total_page);
      setIsLoading(false);

      return fetchedDecks;
    },
    []
  );

  const deleteDeck = useCallback(async (id: string) => {
    try {
      if (confirm('Want to delete?') === true) {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/decks/${id}`);
        setDecks((currentDecks) => currentDecks.filter((d) => d.id !== id));
        toast('Deck deleted!', { type: 'success' });
      }
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, []);

  const pageChangeHandler = useCallback(
    async (selectedItem: { selected: number }) => {
      console.log(getSearchValues('search'))
      const decks = await fetchDecks(
        selectedItem.selected + 1,
        10,
        getSearchValues('search')
      );
      setDecks(decks);
    },
    [fetchDecks, getSearchValues]
  );

  const onSubmitSearch: SubmitHandler<ISearchInput> = async (data) => {
    const searchedDecks = await fetchDecks(1, 10, data.search);
    setDecks(searchedDecks);
  };

  const initData = useCallback(async () => {
    const initDecks = await fetchDecks();
    setDecks(initDecks);
  }, [fetchDecks]);

  useEffect(() => {
    initData();
  }, [initData]);

  return (
    <>
      <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      <div className="py-8">
        <div className="flex flex-row justify-between w-full mb-1 sm:mb-0">
          <h2 className="text-2xl leading-tight">Các chủ đề</h2>
          <div className="text-end">
            <form
              className="flex flex-col justify-center items-center space-y-3 md:flex-row md:w-full md:space-x-3 md:space-y-0"
              onSubmit={handleSearch(onSubmitSearch)}
            >
              <div className=" relative ">
                <input
                  {...searchRegister('search')}
                  type="text"
                  id='"form-subscribe-Filter'
                  className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="tên"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-grey-darkest font-bold py-2 px-4 rounded inline-flex items-center"
              >
                <BsSearch />
                <span className="ml-2 whitespace-nowrap">Tìm kiếm</span>
              </button>
              <button
                className="text-purple-500 background-transparent font-bold uppercase px-8 py-3 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => router.push(`/settings/decks/new`)}
              >
                <span className="whitespace-nowrap">Tạo chủ đề mới</span>
              </button>
            </form>
          </div>
        </div>
        <div className="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div className="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    Tên
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    Mô tả
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  >
                    Tạo lúc
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-sm font-normal text-left text-gray-800 uppercase bg-white border-b border-gray-200"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {decks.map((deck) => (
                  <tr key={deck.id}>
                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <a href="#" className="relative block">
                            <Image
                              width={40}
                              height={40}
                              alt="profil"
                              src={deck.photoUrl ?? ''}
                              className="mx-auto object-cover rounded-full h-10 w-10 "
                            />
                          </a>
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">
                            {deck.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {deck.description}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {new Date(deck.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </td>
                    <td className="px-5 py-5 text-sm bg-white border-b border-gray-200">
                      <div className="flex items-center">
                        <Link href={`/settings/cards?deck_id=${deck.id}`}>
                          <span className="px-4 py-1 flex items-center text-base rounded-full text-blue-600  bg-blue-200">
                            <GiCardRandom className="mr-1" />
                            Các thẻ học
                          </span>
                        </Link>
                        <Link
                          href={`/settings/decks/${deck.id}`}
                          className="text-indigo-600 hover:text-indigo-900 ml-4"
                        >
                          Sửa
                        </Link>
                        <div className="ml-4">
                          <button
                            type="button"
                            className="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded-full outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            onClick={(e) => deleteDeck(deck.id)}
                          >
                            <AiOutlineDelete />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex flex-col items-center px-5 py-5 bg-white xs:flex-row xs:justify-between">
              <Pagination
                pageCount={pageCount}
                onPageChange={pageChangeHandler}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDecks;
