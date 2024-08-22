import { SmallBoard } from "./board-structure";
import { User } from "./user";

export interface Ticket {
  id: number;
  ticketId: number;
  slug: string;
  title: string;
  description: string;
  type: string;
  status: "open" | "inProgress" | "done";
  board: SmallBoard | null;
  creator: User | null;
  assignee: User | null;
  createdAt: number;
  updatedAt: number;
}
