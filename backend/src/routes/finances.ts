import express from "express";
import {
  createAccountEntry,
  createAccountEntryValidations,
  getAllEntries,
  getDashboard,
  getSummary,
  updateAccountEntry,
  updateAccount,
} from "../controllers/finances.js";

const router = express.Router();

router.get("/entries", getAllEntries);
router.post("/entries", createAccountEntryValidations, createAccountEntry);
router.patch("/", updateAccount);
router.patch("/entries/:id", createAccountEntryValidations, updateAccountEntry);
router.get("/summary", getSummary);
router.get("/dashboard", getDashboard);

export default router;
