import mongoose, { Schema, Document } from "mongoose";

export interface INote extends Document {
  title: string;
  content: string;
  category: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" } }
);

export default mongoose.model<INote>("Note", NoteSchema);
