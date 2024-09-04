import { TicketStatus } from "../models/ticket-status";
import { ProjectDTO } from "./project-dto";
import { SmallBoardDTO } from "./small-board-dto";
import { UserDTO } from "./user-dto";

export type ProjectMetaDTO = {
  project: ProjectDTO;
  users: UserDTO[];
  states: TicketStatus[];
  types: string[];
  boards: SmallBoardDTO[];
};
