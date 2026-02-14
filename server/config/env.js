import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
};
