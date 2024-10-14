import { UserDto } from "src/users/dto/user.dto";
import { TicketStatus } from "../models/ticket-status";
import { ProjectDto } from "./project.dto";
import { SmallBoardDto } from "./small-board.dto";

export class ProjectMetaDto {
  project: ProjectDto;
  users: UserDto[];
  states: TicketStatus[];
  types: string[];
  boards: SmallBoardDto[];
}
