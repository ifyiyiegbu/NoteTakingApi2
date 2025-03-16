import { Request, Response, NextFunction } from "express";

export const validateNote = (req: Request, res: Response, next: NextFunction) => {
  const { title, content, category } = req.body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    res.status(400).json({ error: "Title is required and must be a non-empty string" });
    return;
  }

  if (!content || typeof content !== "string" || content.trim().length === 0) {
     res.status(400).json({ error: "Content is required and must be a non-empty string" });
     return;
  }

  if (!category || typeof category !== "string") {
    res.status(400).json({ error: "Category is required and must be a valid string" });
    return;
  }

  next();
};
