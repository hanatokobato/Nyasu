'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import Image from 'next/image';

interface IProps {
  card?: ICard;
  deckId: string;
}

interface IFormInputs {
  word: string;
  translate: string;
  spelling: string;
  example: string;
  example_translate: string;
}

const CardForm: React.FC<IProps> = ({ card, deckId }) => {
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      word: card?.fields.word,
      translate: card?.fields.translate,
      spelling: card?.fields.spelling,
      example: card?.fields.example.sentence,
      example_translate: card?.fields.example.translate,
    },
  });
  const [content, setContent] = useState<{ front: string; back?: string }>(
    card?.content ?? { front: '' }
  );
  const imageAttachmentRef = useRef<HTMLInputElement>(null);
  const audioAttachmentRef = useRef<HTMLInputElement>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | undefined>(
    card?.audioUrl ? new Audio(card?.audioUrl) : undefined
  );

  const onChooseImageAttachment = useCallback(
    async (state: TextState, api: TextAreaTextApi) => {
      try {
        if (imageAttachmentRef.current?.files?.length) {
          const formData = new FormData();
          formData.append('file', imageAttachmentRef.current.files[0]);
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/cards/attachments`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          );
          const { name, path } = res.data.attachment;
          const fileUrl = `${process.env.NEXT_PUBLIC_API_ROOT_URL}${path}`;
          imageAttachmentRef.current.value = '';

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

  const onChooseAudioAttachment = useCallback(() => {
    if (audioAttachmentRef.current?.files?.length) {
      const previewUrl = URL.createObjectURL(
        audioAttachmentRef.current.files[0]
      );
      setAudio(new Audio(previewUrl));
    }
  }, []);

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
        onChooseImageAttachment(state, api);
      };
      if (
        imageAttachmentRef.current?.getAttribute('onSelectImage') !== 'true'
      ) {
        imageAttachmentRef.current?.addEventListener(
          'change',
          selectImageHandler
        );
      }
      imageAttachmentRef.current?.click();
    },
  };

  const playAudio = useCallback(
    (e: any) => {
      e.preventDefault();

      setAudio(new Audio(card?.audioUrl));
    },
    [card?.audioUrl]
  );

  const createCard = useCallback(async (formData: FormData) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cards`, formData);
      toast('Card created!', { type: 'success' });
    } catch (e: any) {
      toast(e.message, { type: 'error' });
    }
  }, []);

  const updateCard = useCallback(
    async (formData: FormData) => {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/cards/${card?.id}`,
          formData
        );
        toast('Card updated!', { type: 'success' });
      } catch (e: any) {
        toast(e.message, { type: 'error' });
      }
    },
    [card?.id]
  );

  const submitHandler = useCallback(
    (data: any) => {
      const formData = new FormData();

      formData.append('content[front]', content.front);
      formData.append('fields[word]', data.word);
      formData.append('fields[translate]', data.translate);
      formData.append('fields[spelling]', data.spelling);
      formData.append('fields[example][sentence]', data.example);
      formData.append('fields[example][translate]', data.example_translate);
      if (content.back) formData.append('content[back]', content.back);
      formData.append('deck_id', deckId);
      if (audioAttachmentRef.current?.files?.length)
        formData.append('file', audioAttachmentRef.current.files[0]);
      card?.id ? updateCard(formData) : createCard(formData);
    },
    [card?.id, createCard, updateCard, content, deckId]
  );

  useEffect(() => {
    if (audio) {
      audio.play();
    }
  }, [audio]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change') {
        switch (name) {
          case 'word':
          case 'spelling':
          case 'translate':
            const backContent = `<h1>${value.word}</h1>\r\n\r\n${value.spelling}\r\n\r\n**${value.translate}**`;
            setContent((cur) => ({ ...cur, back: backContent ?? '' }));
            break;
          case 'example':
            const frontContent = value.example;
            setContent((cur) => ({ ...cur, front: frontContent ?? '' }));
            break;
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <section className="bg-gray-100/50">
      <ToastContainer theme="colored" autoClose={2000} hideProgressBar />
      <form
        className="container max-w-2xl mx-auto shadow-md md:w-3/4"
        onSubmit={handleSubmit(submitHandler)}
      >
        <div className="p-4 border-t-2 rounded-lg bg-gray-100/5 ">
          <div className="max-w-sm mx-auto md:w-full md:mx-0">
            <div className="inline-flex items-center space-x-4">
              <h1 className="text-gray-600">Thẻ</h1>
            </div>
          </div>
        </div>
        <div className="space-y-6 bg-white">
          <div className="p-4">
            <label
              htmlFor="username"
              className="block text-sm text-gray-500 dark:text-gray-300"
            >
              Từ
            </label>

            <input
              {...register('word', { required: true })}
              type="text"
              placeholder="Từ"
              className={`block  mt-2 w-full placeholder-gray-400/70 rounded-lg border ${
                errors.word ? 'border-red-400 focus:ring-red-300' : ''
              } bg-white px-5 py-2.5 text-gray-700 focus:outline-none focus:ring`}
            />

            <p className="mt-3 text-xs text-red-400">
              {errors.word?.type === 'required' && 'This is required field.'}
            </p>

            <input
              {...register('translate', { required: true })}
              type="text"
              placeholder="Dịch nghĩa"
              className={`block  mt-2 w-full placeholder-gray-400/70 rounded-lg border ${
                errors.translate ? 'border-red-400 focus:ring-red-300' : ''
              } bg-white px-5 py-2.5 text-gray-700 focus:outline-none focus:ring`}
            />

            <p className="mt-3 text-xs text-red-400">
              {errors.translate?.type === 'required' &&
                'This is required field.'}
            </p>

            <input
              {...register('spelling', { required: true })}
              type="text"
              placeholder="Cách phát âm"
              className={`block  mt-2 w-full placeholder-gray-400/70 rounded-lg border ${
                errors.spelling ? 'border-red-400 focus:ring-red-300' : ''
              } bg-white px-5 py-2.5 text-gray-700 focus:outline-none focus:ring`}
            />

            <p className="mt-3 text-xs text-red-400">
              {errors.spelling?.type === 'required' &&
                'This is required field.'}
            </p>
          </div>
          <div className="p-4">
            <label className="block text-sm text-gray-500 dark:text-gray-300">
              Ví dụ
            </label>

            <input
              {...register('example', { required: true })}
              type="text"
              placeholder="Ví dụ"
              className={`block  mt-2 w-full placeholder-gray-400/70 rounded-lg border ${
                errors.example ? 'border-red-400 focus:ring-red-300' : ''
              } bg-white px-5 py-2.5 text-gray-700 focus:outline-none focus:ring`}
            />

            <p className="mt-3 text-xs text-red-400">
              {errors.example?.type === 'required' && 'This is required field.'}
            </p>

            <input
              {...register('example_translate')}
              type="text"
              placeholder="Dịch nghĩa câu"
              className={`block  mt-2 w-full placeholder-gray-400/70 rounded-lg border ${
                errors.example_translate
                  ? 'border-red-400 focus:ring-red-300'
                  : ''
              } bg-white px-5 py-2.5 text-gray-700 focus:outline-none focus:ring`}
            />

            <p className="mt-3 text-xs text-red-400">
              {errors.example_translate?.type === 'required' &&
                'This is required field.'}
            </p>
          </div>
          <div>
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <div className="mx-auto w-full">Mặt trước thẻ</div>
            </div>
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <div className="mx-auto w-full">
                <MDEditor
                  value={content?.front}
                  onChange={(val) =>
                    setContent((cur) => ({ ...cur, front: val ?? '' }))
                  }
                  commands={[
                    ...commands
                      .getCommands()
                      .map((i) => (i.name == 'image' ? attachImage : i)),
                  ]}
                />
              </div>
            </div>
          </div>
          <div>
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <div className="mx-auto w-full">Mặt sau thẻ</div>
            </div>
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <div className="mx-auto w-full">
                <MDEditor
                  value={content?.back}
                  onChange={(val) =>
                    setContent((cur) => ({ ...cur, back: val ?? '' }))
                  }
                  commands={[
                    ...commands
                      .getCommands()
                      .map((i) => (i.name == 'image' ? attachImage : i)),
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <div className="mx-auto ml-4 w-full">
              <input
                ref={audioAttachmentRef}
                type="file"
                accept="audio/*"
                onChange={onChooseAudioAttachment}
              />
              {audio && (
                <button className="relative w-14 h-14 bg-neutral-200 rounded-full">
                  <Image
                    src="/sound.svg"
                    alt="sound"
                    width={59}
                    height={59}
                    className="cursor-pointer rounded-full bg-white absolute left-0 bottom-1.5 active:translate-y-1.5 focus:translate-y-1.5"
                    onClick={playAudio}
                  />
                </button>
              )}
            </div>
          </div>
          <hr />
          <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
            <button
              type="submit"
              className="py-2 px-4  bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Lưu
            </button>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={imageAttachmentRef}
          className="invisible"
        />
      </form>
    </section>
  );
};

export default CardForm;
