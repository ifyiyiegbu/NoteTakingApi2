import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Note from "../models/noteModel";
import Category from "../models/category";
import { NotFoundError, BadRequestError } from "../middleware/errorHandler";

/**
 * Create a new note with a valid category (creates "Uncategorized" if missing)
 */
export const createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, category } = req.body;
    let categoryId = category;

    if (!category) {
      let defaultCategory = await Category.findOne({ name: "Uncategorized" });
      if (!defaultCategory) {
        defaultCategory = new Category({ name: "Uncategorized" });
        await defaultCategory.save();
      }
      categoryId = defaultCategory._id;
    } else {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return next(new BadRequestError("Invalid category ID"));
      }

      let existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return next(new BadRequestError("Category not found"));
      }
      categoryId = existingCategory._id;
    }

    const newNote = new Note({ title, content, category: categoryId });
    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch all notes, populating category names
 */
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find().populate("category", "name");
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch notes by category ID
 */
export const getNotesByCategory = async (req: Request<{ categoryId: string }>, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return next(new BadRequestError("Invalid category ID"));
    }

    const notes = await Note.find({ category: categoryId }).populate("category", "name");

    res.json(notes);
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single note by ID
 */
export const getNoteById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new NotFoundError("Invalid note ID"));
    }

    const note = await Note.findById(id).populate("category", "name");
    if (!note) throw new NotFoundError("Note not found");

    res.json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing note
 */
export const updateNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, category } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new NotFoundError("Invalid note ID"));
    }

    let categoryId = category;

    if (!category) {
      let defaultCategory = await Category.findOne({ name: "Uncategorized" });
      if (!defaultCategory) {
        defaultCategory = new Category({ name: "Uncategorized" });
        await defaultCategory.save();
      }
      categoryId = defaultCategory._id;
    } else {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return next(new BadRequestError("Invalid category ID"));
      }

      let existingCategory = await Category.findById(category);
      if (!existingCategory) {
        return next(new BadRequestError("Category not found"));
      }
      categoryId = existingCategory._id;
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { title, content, category: categoryId },
      { new: true, runValidators: true }
    );

    if (!updatedNote) throw new NotFoundError("Note not found");

    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a note
 */
export const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new NotFoundError("Invalid note ID"));
    }

    const note = await Note.findByIdAndDelete(id);
    if (!note) throw new NotFoundError("Note not found");

    res.json({ message: `Note with ID ${note._id} deleted successfully` });
  } catch (error) {
    next(error);
  }
};
