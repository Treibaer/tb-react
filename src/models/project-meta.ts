import { SmallBoard } from "./board-structure.dto";
import { Project } from "./project";
import { TicketStatus } from "./ticket-status";
import { User } from "./user";

export interface ProjectMeta {
  project: Project;
  users: User[];
  types: string[];
  states: TicketStatus[];
  boards: SmallBoard[];
}
