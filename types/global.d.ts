import { Card as ICard } from './api';

export {};

declare global {
  interface IReview {
    card: ICard;
  }

  interface IUser {
    email: string;
    role: 'ADMIN' | 'USER';
  }
}
