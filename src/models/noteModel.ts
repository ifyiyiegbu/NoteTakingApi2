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
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model<INote>("Note", NoteSchema);
