import mongoose from "mongoose";

const PairSchema = new mongoose.Schema({
  id: String,
  user1: String,
  user2: String,
  isUser1Turn: { type: Boolean, default: true }
});

export const Pair = mongoose.model('Pair', PairSchema);