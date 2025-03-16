import { Request, Response, NextFunction } from "express";
import Note from "../models/noteModel";
import { NotFoundError, BadRequestError } from "../middleware/errorHandler";

export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) throw new NotFoundError("Note not found");
    res.json(note);
  } catch (error) {
    next(error);
  }
};

export const getNotesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId } = req.params;
    const notes = await Note.find({ category: categoryId }).populate("category");
    res.json(notes);
  } catch (error) {
    next(error);
  }
};


export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) throw new BadRequestError("Title and content are required");

    const newNote = new Note({ title, content });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, category } = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true, runValidators: true }
    ).populate("category");

    if (!updatedNote) throw new NotFoundError("Note not found");
    res.json(updatedNote);
  } catch (error) {
    next(error);
  }
};

  

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) throw new NotFoundError("Note not found");
        res.json({ message: `Note with id: ${ deletedNote._id } deleted` });
    } catch (error) {
        next(error);
    }
};
