import express from "express";
import {
  getAllEnvironments,
  getAllEntries,
  createEnvironment,
  createEntry,
  updateEntry,
} from "../controllers/passwords.js";

const router = express.Router();

router.get("/environments", getAllEnvironments);
router.post("/environments", createEnvironment);
router.get("/environments/:id/entries", getAllEntries);
router.post("/environments/:id/entries", createEntry);
router.patch("/environments/:id/entries/:entryId", updateEntry);

export default router;
