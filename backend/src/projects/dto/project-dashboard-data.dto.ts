import { ProjectDto } from './project.dto';
import { TicketDto } from './ticket.dto';

export class ProjectDashboardDataDto {
  tickets: TicketDto[];
  project: ProjectDto;
  closedTicketsLast30Days: TicketDto[];
  openedTicketsLast30Days: TicketDto[];
}
