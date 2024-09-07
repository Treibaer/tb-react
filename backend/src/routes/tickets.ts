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

router.get("/:slug/tickets/:ticketSlug", async (req, res, next) => {
  const projectSlug = req.params.slug;
  const ticketSlug = req.params.ticketSlug;
  try {
    const ticket = await ticketsService.get(projectSlug, ticketSlug);
    const ticketDTO = await Transformer.ticket(projectSlug, ticket);
    res.status(200).json(ticketDTO);
  } catch (error: any) {
    next(error);
  }
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

router.get("/:slug/tickets/:ticketSlug/history", async (req, res, next) => {
  const ticketSlug = req.params.ticketSlug;
  try {
    const historyList = await ticketsService.getHistory(ticketSlug);
    const historyDTOs = await Promise.all(
      historyList.map(async (history) => Transformer.ticketHistory(history))
    );
    res.status(200).json(historyDTOs);
  } catch (error: any) {
    next(error);
  }
});

export default router;
