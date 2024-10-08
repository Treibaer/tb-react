import express from "express";
import { Ticket } from "../models/ticket.js";
import { TicketService } from "../services/TicketService.js";
import Transformer from "../utils/Transformer.js";

const ticketsService = TicketService.shared;
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
    const ticket = await ticketsService.create(projectSlug, req.body);
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

router.get("/:slug/tickets/:ticketSlug/comments", async (req, res, next) => {
  const ticketSlug = req.params.ticketSlug;
  try {
    const comments = await ticketsService.getComments(ticketSlug);
    const historyDTOs = await Promise.all(
      comments.map(async (comment) => Transformer.ticketComment(comment))
    );
    res.status(200).json(historyDTOs);
  } catch (error: any) {
    next(error);
  }
});

router.post("/:slug/tickets/:ticketSlug/comments", async (req, res, next) => {
  const ticketSlug = req.params.ticketSlug;
  try {
    const comment = await ticketsService.createComment(
      ticketSlug,
      req.body.content
    );
    res.status(201).json(comment);
  } catch (error: any) {
    next(error);
  }
});

router.delete(
  "/:slug/tickets/:ticketSlug/comments/:commentId",
  async (req, res, next) => {
    const ticketSlug = req.params.ticketSlug;
    const commentId = Number(req.params.commentId);
    try {
      await ticketsService.removeComment(ticketSlug, commentId);
      res.status(204).end();
    } catch (error: any) {
      next(error);
    }
  }
);

export default router;
