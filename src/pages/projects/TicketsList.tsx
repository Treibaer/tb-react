import { useRef, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import Dialog from "../../components/common/Dialog";
import { ContextMenu } from "../../components/contextmenu/ContextMenu";
import { data as data2 } from "../../components/contextmenu/data";
import { TicketRow } from "../../components/tickets/TicketRow";
import TitleView from "../../components/TitleView";
import { Project } from "../../models/project";
import { Ticket } from "../../models/ticket";
import ProjectService from "../../services/ProjectService";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import { ROUTES } from "../../routes";

const projectService = ProjectService.shared;

const TicketsList: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [config, setConfig] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    show: false,
  });

  const data = useLoaderData() as {
    tickets: Ticket[];
    project: Project;
  };

  const [tickets, setTickets] = useState<Ticket[]>(data.tickets);
  const [project, setProject] = useState<Project>(data.project);

  function openDialog() {
    setIsCreating(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  async function createTicket() {
    const title = inputRef.current?.value;
    if (!title) {
      return;
    }
    const ticket: Ticket = {
      id: 0,
      ticketId: 0,
      slug: "",
      title,
      description: descriptionRef.current?.value ?? "",
      createdAt: 0,
      updatedAt: 0,
      status: "open",
      creator: null,
      assignee: null,
    };
    await projectService.createTicket(project.slug, ticket);
    const tickets = await projectService.getTickets(project.slug);
    const updatedProject = await projectService.getProject(project.slug);
    setTickets(tickets);
    setProject(updatedProject);
    setIsCreating(false);
  }

  function onContextMenu(e: React.MouseEvent, ticket: Ticket) {
    e.preventDefault();
    console.log("right click");
    console.log("ticket", ticket);
    setConfig({
      top: e.clientY,
      left: e.clientX,
      right: e.clientX,
      bottom: e.clientY,
      show: true,
    });
  }

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "All Tickets", link: "" },
  ];

  return (
    <>
      <ContextMenu data={data2} config={config} />
      {isCreating && (
        <>
          <Dialog
            title={`${project.title} > Create ticket`}
            onClose={() => setIsCreating(false)}
            onSubmit={createTicket}
          >
            <input
              type="text"
              placeholder="Title"
              id="dialogTitle"
              className="tb-textarea"
              ref={inputRef}
            />
            <textarea
              placeholder="Description"
              id="dialogDescription"
              className="tb-textarea"
              ref={descriptionRef}
            ></textarea>
          </Dialog>
        </>
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
  return { tickets, project };
};
