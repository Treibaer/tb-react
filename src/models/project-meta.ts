import { SmallBoard } from "./board-structure";
import { Project } from "./project";
import { Status } from "./status";
import { User } from "./user";

export interface ProjectMeta {
  project: Project;
  users: User[];
  types: string[];
  states: Status[];
  boards: SmallBoard[];
}
