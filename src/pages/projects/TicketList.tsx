import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { ContextMenu } from "../../components/contextmenu/ContextMenu";
import HeaderView from "../../components/HeaderView";
import TicketCreationDialog from "../../components/projects/tickets/TicketCreationDialog";
import TicketRow from "../../components/projects/tickets/TicketRow";
import TitleView from "../../components/TitleView";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ProjectMeta } from "../../models/project-meta";
import { Ticket } from "../../models/ticket";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import TicketService from "../../services/TicketService";

const projectService = ProjectService.shared;
const ticketService = TicketService.shared;

const TicketList: React.FC = () => {
  const data = useLoaderData() as {
    tickets: Ticket[];
    metadata: ProjectMeta;
  };

  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState<TicketsContextMenuConfig>({
    top: 0,
    left: 0,
    show: false,
    ticket: null,
  });

  const [tickets, setTickets] = useState<Ticket[]>(data.tickets);
  const [project, setProject] = useState<Project>(data.metadata.project);

  function openDialog() {
    setIsCreating(true);
  }

  async function onClose(shouldUpdate: boolean) {
    if (shouldUpdate) {
      const tickets = await ticketService.getAll(project.slug);
      const updatedProject = await projectService.get(project.slug);
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

  async function closeContextMenu(shouldUpdate: boolean) {
    setConfig({
      ...config,
      show: false,
      ticket: null,
    });
    if (shouldUpdate) {
      const tickets = await ticketService.getAll(project.slug);
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
          metadata={data.metadata}
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

export default TicketList;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const slug = params.projectSlug ?? "";

  const tickets = await ticketService.getAll(slug);
  const metadata = await projectService.getMetadata(slug);
  return { tickets, metadata };
};
