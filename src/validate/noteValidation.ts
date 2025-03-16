import { z } from "zod";

export const noteSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(5, "Content must be at least 5 characters"),
  category: z.string().length(24, "Invalid category ID"), 
});
