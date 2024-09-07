import express from "express";
import {
  createAccountEntry,
  createAccountEntryValidations,
  getAllEntries,
  updateAccountEntry,
} from "../controllers/finances.js";

const router = express.Router();

router.get("/entries", getAllEntries);
router.post("/entries", createAccountEntryValidations, createAccountEntry);
router.patch("/entries/:id", createAccountEntryValidations, updateAccountEntry);

export default router;
