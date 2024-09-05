import express from "express";
import { Ticket } from "../models/ticket.js";
import { SQLTicketService } from "../services/SQLTicketService.js";
import Transformer from "../utils/Transformer.js";

const ticketsService = SQLTicketService.shared;
const router = express.Router();

router.get("/:slug/tickets", async (req, res) => {
  const projectSlug = req.params.slug;
  const tickets = await ticketsService.getAll(projectSlug);

  const ticketDTOs = await Promise.all(
    tickets.map(async (ticket: Ticket) =>
      Transformer.ticket(projectSlug, ticket)
    )
  );
  res.status(200).json(ticketDTOs);
});

router.post("/:slug/tickets", async (req, res, next) => {
  try {
    const projectSlug = req.params.slug;
    const ticket = await ticketsService.create(
      projectSlug,
      req.body.title,
      req.body.description
    );
    res.status(201).json(ticket);
  } catch (error: any) {
    next(error);
  }
});

router.get("/:slug/tickets/:ticketSlug", async (req, res) => {
  const projectSlug = req.params.slug;
  const ticketSlug = req.params.ticketSlug;
  const ticket = await ticketsService.get(projectSlug, ticketSlug);
  if (!ticket) {
    res.status(404).json({ message: "Ticket not found" });
    return;
  }
  const ticketDTO = await Transformer.ticket(projectSlug, ticket);
  res.status(200).json(ticketDTO);
});

router.patch("/:slug/tickets/:ticketSlug", async (req, res, next) => {
  const projectSlug = req.params.slug;
  const ticketSlug = req.params.ticketSlug;
  try {
    const ticket = await ticketsService.update(
      projectSlug,
      ticketSlug,
      req.body
    );
    res.status(200).json(ticket);
  } catch (error: any) {
    next(error);
  }
});

export default router;
