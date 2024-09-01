export type UserDTO = {
  id: number;
  firstName: string;
  avatar: string;
};

export type TicketDTO = {
  id: number;
  position: number;
  ticketId: number;
  slug: string;
  title: string;
  description: string;
  type: string;
  status: TicketStatus
  board: SmallBoardDTO | null;
  creator: UserDTO | null;
  assignee: UserDTO | null;
  createdAt: number;
  updatedAt: number;
};

export type ProjectDTO = {
  id: number;
  slug: string;
  icon: string;
  title: string;
  description: string;
};

export type BoardDTO = {
  id: number;
  title: string;
  startDate: number;
  endDate: number;
  tickets: TicketDTO[];
  creator: UserDTO;
};

export type SmallBoardDTO = {
  id: number;
  title: string;
};

export type BoardStructureDTO = {
  projectId: number;
  activeBoards: BoardDTO[];
  closed: string[];
  hideDone: boolean;
  backlog: {
    id: number;
    title: string;
    tickets: TicketDTO[];
  }
};

export type ProjectMetaDTO = {
  project: ProjectDTO;
  users: UserDTO[];
  types: string[];
  states: TicketStatus[];
  boards: SmallBoardDTO[];
}

export type TicketStatus = "open" | "inProgress" | "done";
