import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import Button from "../../components/Button";
import HeaderView from "../../components/HeaderView";
import TicketRow from "../../components/projects/tickets/TicketRow";
import { Breadcrumb } from "../../models/breadcrumb";
import { ProjectDashboardData } from "../../models/projects/project-dashboard-data";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/projectService";
import ClosedTicketsChart from "./ProjectChart";

export const ProjectDetailView: React.FC = () => {
  const { project, tickets, closedTicketsLast30Days, openedTicketsLast30Days } =
    useLoaderData() as ProjectDashboardData;
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: "" },
  ];

  let closedTickets: { id: number; closedDate: Date }[] = [];
  let openedTickets: { id: number; createdAt: Date }[] = [];

  closedTickets = closedTicketsLast30Days.map((ticket) => ({
    id: ticket.id,
    closedDate: new Date((ticket.closedAt ?? 0) * 1000),
  }));

  const activityClosedTickets = closedTicketsLast30Days;
  // sort by closed date desc
  activityClosedTickets.sort((a, b) => {
    return (b.closedAt ?? 0) - (a.closedAt ?? 0);
  });

  openedTickets = openedTicketsLast30Days.map((ticket) => ({
    id: ticket.id,
    createdAt: new Date((ticket.createdAt ?? 0) * 1000),
  }));

  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex flex-wrap gap-4 m-2">
        <NavLink to={ROUTES.TICKETS_BOARD_VIEW(project.slug)}>
          <Button title="Board View" />
        </NavLink>
        <NavLink to={ROUTES.BOARDS(project.slug)}>
          <Button title="Boards" />
        </NavLink>
        <NavLink to={ROUTES.PROJECTS_PAGES(project.slug)}>
          <Button title="Pages" />
        </NavLink>
        <NavLink to={ROUTES.TICKETS_LIST(project.slug)}>
          <Button title="All Tickets" />
        </NavLink>
      </div>
      <div className="project-details-wrapper">
        <div className="text-4xl m-2">{project.title}</div>
        <div className="m-2">{project.description}</div>
      </div>

      <ClosedTicketsChart
        closedTickets={closedTickets}
        openTickets={openedTickets}
      />

      <div className="p-2 flex gap-1 flex-col">
        <div className="flex items-center justify-between px-4 h-11 bg-header rounded-lg">
          My Tickets
        </div>
        <div className="flex flex-col w-full">
          {tickets.map((ticket) => (
            <TicketRow
              key={ticket.id}
              ticket={ticket}
              project={project}
              onContextMenu={() => {}}
              onTouchStart={() => {}}
            />
          ))}
        </div>
      </div>
      <div>
        {activityClosedTickets.length > 0 && (
          <div className="p-2 flex gap-1 flex-col">
            <div className="flex items-center justify-between px-4 h-11 bg-header rounded-lg">
              <div>Closed Tickets Last 30 Days</div>
              <div>{activityClosedTickets.length} tickets</div>
            </div>
            <div className="flex flex-col w-full">
              {activityClosedTickets.map((ticket) => (
                <TicketRow
                  key={ticket.id}
                  ticket={ticket}
                  project={project}
                  onContextMenu={() => {}}
                  onTouchStart={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectDetailView;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const { projectSlug } = params as { projectSlug: string };
  if (!projectSlug) {
    throw new Error("Project slug is missing");
  }
  return await ProjectService.shared.getDashboardData(projectSlug);
};
