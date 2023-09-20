import mongoose from "mongoose";

const sequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1 },
});

const Sequence = mongoose.model("Sequence", sequenceSchema);

export const getNextSequenceValue = async (sequenceName: string) => {
  const sequence = await Sequence.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequence.sequence_value;
};
