import dotenv from "dotenv";

dotenv.config();

export default {
  RABBITMQ_URL: process.env.RABBITMQ_URL!,
  PORT: process.env.PORT || 3000,
};
