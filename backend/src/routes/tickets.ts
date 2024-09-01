import express from "express";
import { ITicketService } from "../services/interfaces/ITicketService.js";
import { SQLTicketService } from "../services/SQLTicketService.js";

const ticketsService: ITicketService = SQLTicketService.shared;
const router = express.Router();

router.get("/:slug/tickets", async (req, res) => {
  const projectSlug = req.params.slug;
  const tickets = await ticketsService.getAll(projectSlug);
  res.status(200).json(tickets);
});

router.post("/:slug/tickets", async (req, res) => {
  const projectSlug = req.params.slug;
  const ticket = await ticketsService.create(
    projectSlug,
    req.body.title,
    req.body.description
  );
  res.status(200).json(ticket);
});

router.get("/:slug/tickets/:ticketSlug", async (req, res) => {
  const projectSlug = req.params.slug;
  const ticketSlug = req.params.ticketSlug;
  const ticket = await ticketsService.get(projectSlug, ticketSlug);
  if (!ticket) {
    res.status(404).json({ message: "Ticket not found" });
    return;
  }
  res.status(200).json(ticket);
});

router.patch("/:slug/tickets/:ticketSlug", async (req, res) => {
  const projectSlug = req.params.slug;
  const ticketSlug = req.params.ticketSlug;
  const ticket = await ticketsService.update(projectSlug, ticketSlug, req.body);
  res.status(200).json(ticket);
});

export default router;
