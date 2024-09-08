import express from "express";
import {
  createAccountEntry,
  createAccountEntryValidations,
  getAllEntries,
  getSummary,
  updateAccountEntry,
} from "../controllers/finances.js";

const router = express.Router();

router.get("/entries", getAllEntries);
router.post("/entries", createAccountEntryValidations, createAccountEntry);
router.patch("/entries/:id", createAccountEntryValidations, updateAccountEntry);
router.get("/summary", getSummary);

export default router;
