import { useEffect, useState } from "react";
import ProjectService from "../services/ProjectService";
import { useLoaderData } from "react-router-dom";
// import { Ticket } from "../models/Models";
type Ticket = {
  id: string;
  title: string;
  description: string;
  // Add other relevant fields
};

const projectService = ProjectService.shared;

const Tickets: React.FC = () => {
  const tickets = useLoaderData() as [Ticket[]];

  return (
    <>
      <h1>Tickets</h1>
      <div className="tickets-wrapper">
        {tickets.map((ticket: any) => (
          <div key={ticket.id}>{ticket.title}</div>
        ))}
      </div>
    </>
  );
};

export default Tickets;

export async function loader({ params }: { params: any }) {
  return await ProjectService.shared.loadTickets(params.projectId);
}
