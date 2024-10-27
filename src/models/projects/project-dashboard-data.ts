import { Project } from "../project";
import { Ticket } from "../ticket";

export type ProjectDashboardData = {
  tickets: Ticket[];
  project: Project;
  closedTicketsLast30Days: Ticket[];
  openedTicketsLast30Days: Ticket[];
};
