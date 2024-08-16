export interface Ticket {
  id: number;
  ticketId: number;
  title: string;
  description: string;
  status: "open" | "inProgress" | "done";
  creator: number | null;
  assignee: number | null;
  createdAt: number;
  updatedAt: number;
}
