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
import { AnimatePresence } from "framer-motion";

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
      await refresh();
    }
    setIsCreating(false);
  }

  async function refresh() {
    const tickets = await ticketService.getAll(project.slug);
    const updatedProject = await projectService.get(project.slug);
    setTickets(tickets);
    setProject(updatedProject);
  }

  function onContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();
    const maxX = window.innerWidth - 175;
    const maxY = window.innerHeight - 175;
    setConfig({
      top: Math.min(e.pageY, maxY),
      left: Math.min(e.pageX, maxX),
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

  const handleTouchStart = (event: React.TouchEvent, ticket: Ticket) => {
    if (event.touches.length !== 2) {
      return;
    }
    const touch = event.touches[0];
    const touch1 = event.touches[1];
    const touchX = Math.min(touch.clientX, touch1.clientX);
    const touchY = Math.min(touch.clientY, touch1.clientY);
    setConfig({
      top: touchY,
      left: touchX,
      show: true,
      ticket,
    });
  };

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
      <AnimatePresence>
        {isCreating && (
          <TicketCreationDialog
            metadata={data.metadata}
            onClose={onClose}
            updateBoardView={refresh}
          />
        )}
      </AnimatePresence>
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title="Tickets" openDialog={openDialog} />
      <div className="m-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            onContextMenu={(e) => onContextMenu(e, ticket)}
            onTouchStart={(e) => handleTouchStart(e, ticket)}
          >
            <TicketRow project={project} ticket={ticket} />
          </div>
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
