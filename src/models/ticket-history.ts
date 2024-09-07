import { User } from "./user";

export interface TicketHistory {
  createdAt: number;
  description: string;
  versionNumber: number;
  creator: User;
}
