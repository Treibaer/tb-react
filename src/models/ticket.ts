import { User } from "./user";

export interface Ticket {
  id: number;
  ticketId: number;
  slug: string;
  title: string;
  description: string;
  status: "open" | "inProgress" | "done";
  creator: User | null;
  assignee: User | null;
  createdAt: number;
  updatedAt: number;
}
