export {};

declare global {
  interface IDeck {
    id: string;
    name: string;
    description?: string;
    photoUrl?: string;
    createdAt?: date;
  }

  interface ICard {
    id: string;
    content: string;
    deckId: string;
    audioUrl: string;
  }
}
