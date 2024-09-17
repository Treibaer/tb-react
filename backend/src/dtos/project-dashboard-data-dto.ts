import { ProjectDTO } from "./project-dto";
import { TicketDTO } from "./ticket-dto";

export type ProjectDashboardDataDTO = {
  tickets: TicketDTO[];
  project: ProjectDTO;
};
