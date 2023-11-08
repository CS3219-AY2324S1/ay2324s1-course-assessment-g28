import mongoose from "mongoose";

const PairSchema = new mongoose.Schema({
  id: String,
  user1: String,
  user2: String,
  currTurn: String,
  wsUrl1: String,
  wsUrl2: String,
  questionId: Number,
  complexity: Number
});

export const Pair = mongoose.model('Pair', PairSchema);