import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { ContextMenu } from "../../components/contextmenu/ContextMenu";
import HeaderView from "../../components/HeaderView";
import { TicketRow } from "../../components/tickets/TicketRow";
import TitleView from "../../components/TitleView";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ProjectMeta } from "../../models/project-meta";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import TicketCreationDialog from "./TicketCreationDialog";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";

const projectService = ProjectService.shared;

const TicketsList: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState<TicketsContextMenuConfig>({
    top: 0,
    left: 0,
    show: false,
    ticket: null,
  });

  const data = useLoaderData() as {
    tickets: Ticket[];
    project: Project;
    metadata: ProjectMeta;
  };

  const [tickets, setTickets] = useState<Ticket[]>(data.tickets);
  const [project, setProject] = useState<Project>(data.project);
  const [metadata, setMetaData] = useState<ProjectMeta>(data.metadata);

  function openDialog() {
    setIsCreating(true);
  }

  async function onClose(update: boolean) {
    if (update) {
      const tickets = await projectService.getTickets(project.slug);
      const updatedProject = await projectService.getProject(project.slug);
      setTickets(tickets);
      setProject(updatedProject);
    }
    setIsCreating(false);
  }

  function onContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();
    setConfig({
      top: e.pageY,
      left: e.pageX,
      show: true,
      ticket,
    });
  }

  async function closeContextMenu(update: boolean) {
    setConfig({
      ...config,
      show: false,
      ticket: null,
    });
    if (update) {
      const tickets = await projectService.getTickets(project.slug);
      setTickets(tickets);
    }
  }

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "All Tickets", link: "" },
  ];

  return (
    <>
      {config.show && (
        <ContextMenu
          project={project}
          metadata={metadata}
          config={config}
          onClose={closeContextMenu}
        />
      )}
      {isCreating && (
        <TicketCreationDialog project={project} onClose={onClose} />
      )}
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title="Tickets" openDialog={openDialog} />
      <div>
        {tickets.map((ticket) => (
          <TicketRow
            key={ticket.id}
            project={project}
            ticket={ticket}
            onContextMenu={onContextMenu}
          />
        ))}
      </div>
    </>
  );
};

export default TicketsList;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const slug = params.projectSlug ?? "";

  const project = await projectService.getProject(slug);
  const tickets = await projectService.getTickets(slug);
  const metadata = await projectService.getProjectMetadata(slug);
  return { tickets, project, metadata };
};
