import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import Button from "../../components/Button";
import HeaderView from "../../components/HeaderView";
import TicketRow from "../../components/projects/tickets/TicketRow";
import { Breadcrumb } from "../../models/breadcrumb";
import { ProjectDashboardData } from "../../models/projects/project-dashboard-data";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";

export const ProjectDetailView: React.FC = () => {
  const { project, tickets } = useLoaderData() as ProjectDashboardData;
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: "" },
  ];
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
      </div>{" "}
      <div className="flex items-center justify-between px-4 h-11 bg-mediumBlue border-b border-b-darkBlue">
        My Tickets
      </div>
      <div className="flex flex-col w-full">
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            ticket={ticket}
            project={project}
            onContextMenu={() => {}}
          />
        ))}
      </div>
    </>
  );
};

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const { projectSlug } = params as { projectSlug: string };
  if (!projectSlug) {
    throw new Error("Project slug is missing");
  }
  return await ProjectService.shared.getDashboardData(projectSlug);
};

export default ProjectDetailView;
