'use client';

import axios from 'axios';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';

interface IProps {
  deck?: IDeck;
}

type FormValues = {
  name: string;
  description: string;
  photo: File[];
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values,
    errors: !values.name
      ? {
          name: {
            type: 'required',
            message: 'This is required.',
          },
        }
      : {},
  };
};

const DeckForm: React.FC<IProps> = ({ deck }) => {
  const [image, setImage] = useState<string>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver,
    defaultValues: {
      name: deck?.name,
      description: deck?.description,
    },
  });

  const updateDeck = useCallback(async (id: string, formData: FormData) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/decks/${id}`,
        formData
      );
      toast('Deck updated!', { type: 'success' });
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, []);

  const createDeck = useCallback(async (formData: FormData) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/decks`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reset({ name: '', description: '', photo: [] });
      setImage(undefined);
      toast('Deck created!', { type: 'success' });
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, []);

  const submitHandler = useCallback(
    (data: FormValues) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('photo', data.photo[0]);

      const res = deck?.id
        ? updateDeck(deck.id, formData)
        : createDeck(formData);
    },
    [deck?.id, updateDeck, createDeck]
  );

  const onImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  return (
    <section className="h-screen bg-gray-100/50">
      <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      <form
        className="container max-w-2xl mx-auto shadow-md md:w-3/4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="p-4 border-t-2 border-indigo-400 rounded-lg bg-gray-100/5 ">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
              <h1 className="text-gray-600">Deck</h1>
            </div>
          </div>
        </div>
        <div className="space-y-6 bg-white">
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">Name</h2>
            <div className="max-w-sm mx-auto md:w-2/3">
              <div className=" relative ">
                <input
                  type="text"
                  className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Deck name"
                  {...register('name')}
                />
              </div>
            </div>
          </div>
          <hr />
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">Description</h2>
            <div className="max-w-sm mx-auto space-y-5 md:w-2/3">
              <div>
                <div className=" relative ">
                  <input
                    type="text"
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Deck description"
                    {...register('description')}
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="items-center w-full p-8 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-4/12">Photo</h2>
            <div className="flex flex-col">
              <input
                className="relative m-0 block min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="formFile"
                {...register('photo')}
                onChange={onImageChange}
              />
              {(deck?.photoUrl || image) && (
                <img
                  src={image ? image : deck?.photoUrl}
                  alt="deck"
                  className="mt-4 object-cover rounded-full h-20 w-20"
                />
              )}
            </div>
          </div>
          <hr />
          <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
            <button
              type="submit"
              className="py-2 px-4  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default DeckForm;
