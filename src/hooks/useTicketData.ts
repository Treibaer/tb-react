import { useEffect, useState } from "react";
import { useLoaderData, useLocation } from "react-router-dom";
import { ProjectMeta } from "../models/project-meta";
import { Ticket } from "../models/ticket";
import { TicketComment } from "../models/ticket-comment";
import { TicketHistory } from "../models/ticket-history";
import TicketService from "../services/ticketService";

const ticketService = TicketService.shared;

function useTicketData() {
  const location = useLocation();
  const {
    metadata: initalMetadata,
    ticket: initialTicket,
    isOldVersion,
    history: initialHistory,
    comments,
  } = useLoaderData() as {
    metadata: ProjectMeta;
    ticket: Ticket;
    isOldVersion: boolean;
    history: TicketHistory[];
    comments: TicketComment[];
  };

  const [metadata, setMetadata] = useState(initalMetadata);
  const [ticket, setTicket] = useState<Ticket>(initialTicket);
  const [history, setHistory] = useState<TicketHistory[]>(initialHistory);

  useEffect(() => {
    setTicket(initialTicket);
    setHistory(initialHistory);
    setMetadata(initalMetadata);
  }, [location.pathname, initialTicket, initialHistory, initalMetadata]);


  async function fetchHistory() {
    const newHistory = await ticketService.getHistory(
      metadata.project.slug,
      ticket.slug
    );
    setHistory(newHistory);
  }

  return {
    metadata,
    ticket,
    setTicket,
    history,
    isOldVersion,
    comments,
    fetchHistory
  };
}

export default useTicketData;
