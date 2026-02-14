import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/calendar", calendarRoutes);

export default app;
