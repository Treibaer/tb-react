import express from "express";
import { IProjectService } from "../services/IProjectService.js";
import { ProxyProjectService } from "../services/ProxyProjectService.js";
import { IBoardService } from "../services/IBoardService.js";
import { ProxyBoardService } from "../services/ProxyBoardService.js";
import { ITicketService } from "../services/ITicketService.js";
import { ProxyTicketService } from "../services/ProxyTicketService.js";

const projectsService: IProjectService = ProxyProjectService.shared;
const boardService: IBoardService = ProxyBoardService.shared;
const ticketsService: ITicketService = ProxyTicketService.shared;
const router = express.Router();

router.get("/", async (_, res) => {
  const projects = await projectsService.getProjects();
  res.status(200).json(projects);
});

router.get("/:slug", async (req, res) => {
  const projectSlug = req.params.slug;
  const project = await projectsService.getProject(projectSlug);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  res.status(200).json(project);
});

router.get("/:slug/metadata", async (req, res) => {
  const projectSlug = req.params.slug;
  const project = await projectsService.getMetadata(projectSlug);
  if (!project) {
    res.status(404).json({ message: "Project not found" });
    return;
  }
  res.status(200).json(project);
});

router.get("/:slug/tickets-board-structure", async (req, res) => {
  const projectSlug = req.params.slug;
  const boardStructure = await boardService.getBoardStructure(projectSlug);
  res.status(200).json(boardStructure);
});

router.get("/:slug/boards", async (req, res) => {
  const projectSlug = req.params.slug;
  const boards = await boardService.getAll(projectSlug);
  res.status(200).json(boards);
});

router.get("/:slug/boards/:id", async (req, res) => {
  const projectSlug = req.params.slug;
  const boardId = parseInt(req.params.id);
  const board = await boardService.get(projectSlug, boardId);
  if (!board) {
    res.status(404).json({ message: "Board not found" });
    return;
  }
  res.status(200).json(board);
});

router.post("/:slug/boards/:id/open", async (req, res) => {
  const projectSlug = req.params.slug;
  const boardId = parseInt(req.params.id);
  await boardService.open(projectSlug, boardId);
  res.status(200).json({ message: "Board opened" });
});

router.post("/:slug/boards/:id/close", async (req, res) => {
  const projectSlug = req.params.slug;
  const boardId = parseInt(req.params.id);
  await boardService.close(projectSlug, boardId);
  res.status(200).json({ message: "Board closed" });
});

router.post("/:slug/settings", async (req, res) => {
  const projectSlug = req.params.slug;
  await boardService.updateSettings(projectSlug, req.body);

  res.status(200).json({ message: "Board updated" });
});

router.get("/:slug/tickets", async (req, res) => {
  const projectSlug = req.params.slug;
  const tickets = await ticketsService.getAll(projectSlug);
  res.status(200).json(tickets);
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

// router.post("/", async (req, res) => {
//   const rawProject = req.body;

//   if (!rawProject.title) {
//     res.status(400).json({ message: "Invalid project" });
//     return;
//   }

//   const project: Project = {
//     id: rawProject.id,
//     slug: rawProject.slug,
//     title: rawProject.title,
//     description: rawProject.description,
//   };

//   try {
//     await projectsService.saveProject(project);
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//     return;
//   }
//   res.status(200).json(project);
// });
// // tickets
// router.get("/:id/tickets", async (req, res) => {
//   const tickets = await TicketsService.shared.loadTickets(
//     parseInt(req.params.id)
//   );
//   res.status(200).json(tickets);
// });
// router.post("/:id/tickets", async (req, res) => {
//   const rawTicket = req.body;

//   if (!rawTicket.title) {
//     res.status(400).json({ message: "title is missing" });
//     return;
//   }
//   if (!rawTicket.status) {
//     res.status(400).json({ message: "status is missing" });
//     return;
//   }

//   const ticket: Ticket = {
//     id: rawTicket.id,
//     ticketId: rawTicket.localId,
//     title: rawTicket.title,
//     createdAt: 0,
//     updatedAt: 0,
//     status: rawTicket.status,
//     description: rawTicket.description,
//     projectId: parseInt(req.params.id),
//   };

//   try {
//     const savedTicket = await TicketsService.shared.saveTicket(ticket);
//     res.status(200).json(savedTicket);
//   } catch (error: any) {
//     res.status(400).json({ message: error.message });
//   }
// });

export default router;
