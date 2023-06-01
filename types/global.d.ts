export {};

declare global {
  interface IDeck {
    id: string;
    name: string;
    description?: string;
    createdAt?: date;
  }
}
