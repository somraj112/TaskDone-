import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";

mongoose.connect(env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(env.PORT, () =>
    console.log(`Server running on ${env.PORT}`)
  );
});
