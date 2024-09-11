import { UserDTO } from "./user-dto";

export type TicketCommentDTO = {
  id: number;
  createdAt: number;
  content: string;
  creator: UserDTO;
};
