const express = require('express');
import {
  getNotes,
  getNoteById,
  getNotesByCategory,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/noteController";
import { validateRequest } from "../middleware/validation";
import { noteSchema } from "../validate/noteValidation";

const router = express.Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.get("/categories/:categoryId", getNotesByCategory);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
