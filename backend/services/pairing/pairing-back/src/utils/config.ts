import dotenv from "dotenv";

dotenv.config();

export default {
  RABBITMQ_URL: process.env.RABBITMQ_URL!,
  PORT: process.env.PORT || 3000,
  LOGGING_LEVEL: process.env.LOGGING_LEVEL || "info",
  MATCHMAKING_MAX_WAIT_SECONDS: Number(process.env.MATCHMAKING_MAX_WAIT) || 100,
};
