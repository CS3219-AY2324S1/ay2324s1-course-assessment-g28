import mongoose from "mongoose";

const PairSchema = new mongoose.Schema({
  id: String,
  user1: String,
  user2: String,
  currTurn: String,
  wsUrl1: String,
  wsUrl2: String,
  questionId: Number,
  complexity: Number,
  expireAt: {
    type: Date,
    expires: 0,
    default: () => new Date(Date.now() + 24 * 3600) // Default expiry 1 day
  }
});

export const Pair = mongoose.model('Pair', PairSchema);