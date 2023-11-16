import { Card as ICard } from "./api";

export {};

declare global {
  interface IDeck {
    id: string;
    name: string;
    description?: string;
    photoUrl?: string;
    createdAt?: date;
    hasUnlearnedCard: boolean;
  }

  interface IReview {
    card: ICard;
  }

  interface IUser {
    email: string;
    role: 'ADMIN' | 'USER';
  }
}
