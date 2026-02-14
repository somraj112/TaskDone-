import { Router } from "express";
import { createEvent, getEvents, updateEvent, deleteEvent } from "../controllers/calendar.controller.js";

const router = Router();

router.get("/events", getEvents);
router.post("/add", createEvent);
router.put("/update/:id", updateEvent);
router.delete("/delete/:id", deleteEvent);

export default router;
