import express from "express";
import { IProjectService } from "../services/interfaces/IProjectService.js";
import { ProxyProjectService } from "../services/ProxyProjectService.js";

const projectsService: IProjectService = ProxyProjectService.shared;
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

router.post("/", async (req, res) => {
  const project = await projectsService.createProject(req.body);
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
