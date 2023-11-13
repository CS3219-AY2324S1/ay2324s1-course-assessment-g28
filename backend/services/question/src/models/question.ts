import mongoose, { Document } from "mongoose";
import { getNextSequenceValue } from "./sequence";

interface IQuestion extends Document {
  id: number;
  title: string;
  description: Record<string, any>;
  category: string[];
  complexity: number;
}

const questionSchema = new mongoose.Schema<IQuestion>({
  id: { type: Number, unique: true, index: true },
  title: { type: String, required: true, unique: true },
  description: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  category: { type: [String], required: true },
  complexity: { type: Number, enum: [0, 1, 2], required: true },
});

// auto increment id field before saving!
questionSchema.pre("save", async function (next) {
  if (!this.id) {
    try {
      const nextId = await getNextSequenceValue("Question");
      this.id = nextId;
      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

export const Question = mongoose.model<IQuestion>("Question", questionSchema);
