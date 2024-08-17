import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import { Project } from "../models/project";
import { Ticket } from "../models/ticket";
import ProjectService from "../services/ProjectService";
import { FormatType, formatUnixTimestamp } from "../utils/dataUtils";

const projectService = ProjectService.shared;

export default function TicketDetails() {
  const { ticket, project } = useLoaderData() as {
    ticket: Ticket;
    project: Project;
  };

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
  ticketSlug: string;
}> = async ({ params }) => {
  const projectSlug = params.projectSlug ?? "";
  const ticketSlug = params.ticketSlug ?? "";

  const project = await projectService.loadProjectBySlug(projectSlug);
  const ticket = await projectService.loadTicket(projectSlug, ticketSlug);

  return { ticket, project };
};
