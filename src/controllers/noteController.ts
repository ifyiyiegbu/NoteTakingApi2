import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Note from "../models/noteModel";
import Category from "../models/category";
import { NotFoundError } from "../middleware/errorHandler";

export const createNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, category } = req.body;
    let categoryId = category;

    if (!category) {
      // Assign a default category
      let defaultCategory = await Category.findOne({ name: "Uncategorized" });
      if (!defaultCategory) {
        defaultCategory = new Category({ name: "Uncategorized" });
        await defaultCategory.save();
      }
      categoryId = defaultCategory._id;
    } else if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    } else {
      // Check if category exists; if not, create it with a default name
      let existingCategory = await Category.findById(category);
      if (!existingCategory) {
        res.status(400).json({ message: "Category not found" });
        return;
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

    let categoryId = category;

    if (!category) {
      let defaultCategory = await Category.findOne({ name: "Uncategorized" });
      if (!defaultCategory) {
        defaultCategory = new Category({ name: "Uncategorized" });
        await defaultCategory.save();
      }
      categoryId = defaultCategory._id;
    } else if (!mongoose.Types.ObjectId.isValid(category)) {
      res.status(400).json({ message: "Invalid category ID" });
      return;
    } else {
      let existingCategory = await Category.findById(category);
      if (!existingCategory) {
        res.status(400).json({ message: "Category not found" });
        return;
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
