import express from "express";
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNotesByCategory,
} from "../controllers/noteController"; 
import { validateNote } from "../middleware/validation";

const router = express.Router();

router.get("/", getNotes);
router.get("/:id", getNoteById);
router.get("/categories/:categoryId", getNotesByCategory);
router.post("/", validateNote, createNote);
router.put("/:id", validateNote, updateNote);
router.delete("/:id", deleteNote);

export default router;
