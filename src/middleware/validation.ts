import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateNote = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, category } = req.body;

  // Validate title
  if (typeof title !== "string" || title.trim().length === 0 || title.length > 200) {
    res.status(400).json({ error: "Title is required and must be a non-empty string with a maximum length of 200 characters" });
    return;
  }

  // Validate content
  if (typeof content !== "string" || content.trim().length === 0 || content.length > 5000) {
    res.status(400).json({ error: "Content is required and must be a non-empty string with a maximum length of 5000 characters" });
    return;
  }

  // Validate category as a valid ObjectId
  if (!category || typeof category !== "string" || !mongoose.Types.ObjectId.isValid(category)) {
    res.status(400).json({ error: "Category is required and must be a valid MongoDB ObjectId" });
    return;
  }

  next();
};
