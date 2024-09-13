import { UserDTO } from "./user-dto";

export type PageDTO = {
  id: number;
  title: string;
  content: string;
  enrichedContent: string;
  icon: string;
  position: number;
  creator: UserDTO;
  updator: UserDTO;
  createdAt: number;
  updatedAt: number;
  parentId: number | null;
  children: PageDTO[];
};
