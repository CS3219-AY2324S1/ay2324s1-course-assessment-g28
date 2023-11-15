const mongoose = require("mongoose");
const fs = require("fs");

const MONGO_URI = "mongodb://localhost:27018/questions";

const questionSchema = new mongoose.Schema({
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
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Question = mongoose.model("Question", questionSchema);

const sequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 1 },
});

const Sequence = mongoose.model("Sequence", sequenceSchema);

const getNextSequenceValue = async (sequenceName) => {
  const sequence = await Sequence.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );
  return sequence.sequence_value;
};

async function getQuestions() {
  try {
    mongoose.connect(MONGO_URI);
    const data = await Question.find({});
    fs.writeFileSync(
      __dirname + "/sample_questions.json",
      JSON.stringify(data)
    );
  } catch (error) {
    console.log(`saveQuestions failed: error ${error}`);
  } finally {
    await mongoose.disconnect();
  }
}

getQuestions();
