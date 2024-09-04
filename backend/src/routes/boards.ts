import express from "express";
import SQLBoardService from "../services/SQLBoardService.js";
import Transformer from "../utils/Transformer.js";

const boardService = SQLBoardService.shared;
const router = express.Router();

router.get("/:slug/tickets-board-structure", async (req, res) => {
  const projectSlug = req.params.slug;
  const boardStructure = await boardService.getBoardStructure(projectSlug);
  res.status(200).json(boardStructure);
});

router.get("/:slug/boards", async (req, res) => {
  try {
    const projectSlug = req.params.slug;
    const boards = await boardService.getAll(projectSlug);
    const boardDTOs = await Promise.all(boards.map(Transformer.board));
    res.status(200).json(boardDTOs);
  } catch (error: any) {
    // throw error on development mode
    // throw error;
    res.status(400).json({ message: error.message });
  }
});

router.get("/:slug/boards/:id", async (req, res) => {
  const boardId = parseInt(req.params.id);
  const board = await boardService.get(boardId);
  if (!board) {
    res.status(404).json({ message: "Board not found" });
    return;
  }
  res.status(200).json(await Transformer.board(board));
});

router.post("/:slug/boards/:id/open", async (req, res) => {
  // const projectSlug = req.params.slug;
  const boardId = parseInt(req.params.id);
  await boardService.open(boardId);
  res.status(200).json({ message: "Board opened" });
});

router.post("/:slug/boards/:id/close", async (req, res) => {
  // const projectSlug = req.params.slug;
  const boardId = parseInt(req.params.id);
  await boardService.close(boardId);
  res.status(200).json({ message: "Board closed" });
});

router.post("/:slug/settings", async (req, res) => {
  const projectSlug = req.params.slug;
  await boardService.updateSettings(projectSlug, req.body);

  res.status(200).json({ message: "Board updated" });
});

export default router;
