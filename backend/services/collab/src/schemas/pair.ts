import mongoose from "mongoose";

const PairSchema = new mongoose.Schema({
  id: String,
  user1: String,
  user2: String
});

export const Pair = mongoose.model('Pair', PairSchema);