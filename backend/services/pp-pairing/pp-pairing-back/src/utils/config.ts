import dotenv from "dotenv";

dotenv.config();

export default {
  RABBITMQ_URL: process.env.RABBITMQ_URL!,
  LOGGING_LEVEL: process.env.LOGGING_LEVEL || "info",
};
