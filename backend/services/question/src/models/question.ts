import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  complexity: { type: String, required: true },
});

export const Question = mongoose.model("Question", questionSchema);
