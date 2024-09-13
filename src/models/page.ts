import { User } from "./user";

export type Page = {
  id: number;
  title: string;
  position: number;
  content: string;
  enrichedContent: string;
  icon: string;
  creator: User;
  updator: User;
  createdAt: number;
  updatedAt: number;
  parentId: number | null;
  children: Page[];
};
