import { LoaderFunction, useLoaderData } from "react-router-dom";
import ProjectService from "../services/ProjectService";
import { useState } from "react";
import { Project } from "../models/project";
import { Ticket } from "../models/ticket";
import { FormatType, formatUnixTimestamp } from "../utils/dataUtils";

const projectService = ProjectService.shared;

export default function TicketDetails() {
  const data = useLoaderData() as {
    ticket: Ticket;
    project: Project;
  };

  const [ticket, setTicket] = useState<Ticket>(data.ticket);

  return (
    <div>
      <h1>Ticket Detail View</h1>
      <h2>{ticket.title}</h2>
      <p>{ticket.description}</p>
      <p>Status: {ticket.status}</p>
      <div>
        Created: {formatUnixTimestamp(ticket.createdAt, FormatType.DAY_TIME)}
      </div>
      <div>
        Updated: {formatUnixTimestamp(ticket.updatedAt, FormatType.DAY_TIME)}
      </div>
    </div>
  );
}

export const loader: LoaderFunction<{
  projectSlug: string;
  ticketId: number;
}> = async ({ params }) => {
  const slug = params.projectSlug ?? "";
  const ticketId = parseInt(params.ticketId ?? "0");

  const project = await projectService.loadProjectBySlug(slug);
  const ticket = await projectService.loadTicket(project.id, ticketId);

  return { ticket, project };
};
