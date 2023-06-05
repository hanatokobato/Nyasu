'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import MDEditor, {
  ICommand,
  TextState,
  TextAreaTextApi,
  commands,
} from '@uiw/react-md-editor';
import '@uiw/react-md-editor/dist/markdown-editor.css';
import '@uiw/react-markdown-preview/dist/markdown.css';
import axios from 'axios';

interface IProps {
  card?: ICard;
  deckId: string;
}

const CardForm: React.FC<IProps> = ({ card, deckId }) => {
  const { handleSubmit } = useForm();
  const [content, setContent] = useState<string | undefined>(card?.content);
  const attachmentRef = useRef<HTMLInputElement>(null);

  const onChooseAttachment = useCallback(
    async (state: TextState, api: TextAreaTextApi) => {
      try {
        if (attachmentRef.current?.files?.length) {
          const formData = new FormData();
          formData.append('file', attachmentRef.current.files[0]);
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/cards/attachments`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          );
          const { name, path } = res.data.attachment;
          const fileUrl = `${process.env.NEXT_PUBLIC_API_ROOT_URL}${path}`;
          attachmentRef.current.value = '';

          // Replaces the current selection with the image
          const imageTemplate = fileUrl;
          api.replaceSelection(`![${name}](${imageTemplate})`);
        }
      } catch (e: any) {
        toast(e.message, { type: 'error' });
        throw e;
      }
    },
    []
  );

  const attachImage: ICommand = {
    name: 'image',
    keyCommand: 'image',
    shortcuts: 'ctrlcmd+i',
    buttonProps: { 'aria-label': 'Add image', title: 'Add image' },
    icon: (
      <svg width="12" height="12" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        />
      </svg>
    ),
    execute: (state: TextState, api: TextAreaTextApi) => {
      const selectImageHandler = (e: any) => {
        e.target.setAttribute('onSelectImage', 'true');
        onChooseAttachment(state, api);
      };
      if (attachmentRef.current?.getAttribute('onSelectImage') !== 'true') {
        attachmentRef.current?.addEventListener('change', selectImageHandler);
      }
      attachmentRef.current?.click();
    },
  };

  const createCard = useCallback(async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cards`, {
        content,
        deck_id: deckId,
      });
      toast('Card created!', { type: 'success' });
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, [content, deckId]);

  const updateCard = useCallback(async () => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/cards/${card?.id}`, {
        content,
        deck_id: deckId,
      });
      toast('Card updated!', { type: 'success' });
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, [content, card?.id, deckId]);

  const submitHandler = useCallback(
    (data: any) => {
      card?.id ? updateCard() : createCard();
    },
    [card?.id, createCard, updateCard]
  );

  return (
    <section className="h-screen bg-gray-100/50">
      <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      <form
        className="container max-w-2xl mx-auto shadow-md md:w-3/4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="p-4 border-t-2 border-green-400 rounded-lg bg-gray-100/5 ">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
              <h1 className="text-gray-600">Card</h1>
            </div>
          </div>
        </div>
        <div className="space-y-6 bg-white">
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <div className="mx-auto ml-4 w-full">
              <MDEditor
                value={content}
                onChange={setContent}
                commands={[
                  ...commands
                    .getCommands()
                    .map((i) => (i.name == 'image' ? attachImage : i)),
                ]}
              />
            </div>
          </div>
          <hr />
          <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
            <button
              type="submit"
              className="py-2 px-4  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Save
            </button>
          </div>
        </div>
        <input type="file" ref={attachmentRef} className="invisible" />
      </form>
    </section>
  );
};

export default CardForm;
