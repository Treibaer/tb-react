import { User } from "./user";

export interface TicketComment {
  id: number
  createdAt: number;
  content: string;
  creator: User;
}
