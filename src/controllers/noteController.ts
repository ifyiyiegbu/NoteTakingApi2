import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Note from "../models/noteModel";
import Category from "../models/category";
import { NotFoundError } from "../middleware/errorHandler";

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, category } = req.body;

    // Validate category ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    }

    // Check if the category exists, otherwise create a new one
    const existingCategory = await Category.findById(category) ?? await new Category({ _id: category }).save();

    // Create new note
    const newNote = new Note({ title, content, category: existingCategory._id });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find().populate("category", "name");
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid note ID" });
      return;
    }

    const note = await Note.findById(id).populate("category", "name");
    if (!note) throw new NotFoundError("Note not found");

    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, category } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid note ID" });
      return;
    }

    // Check if the category exists, otherwise create a new one
    let existingCategory;
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      existingCategory = await Category.findById(category) ?? await new Category({ _id: category }).save();
    }

    // Update the note
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, category: existingCategory?._id },
      { new: true, runValidators: true }
    );

    if (!updatedNote) throw new NotFoundError("Note not found");

    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid note ID" });
      return;
    }

    const note = await Note.findByIdAndDelete(id);
    if (!note) throw new NotFoundError("Note not found");

    res.json({ message: `Note with ID ${note._id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};
