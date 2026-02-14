import { User } from "../models/user.model.js";
import { addEvent, fetchEvents } from "../services/calendar.service.js";

export const createEvent = async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(401).json({ message: "Login required" });
    }

    const { title, description, start, end } = req.body;

    if (!title || !start || !end) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const event = {
      summary: title,
      description,
      start: {
        dateTime: start,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: end,
        timeZone: "Asia/Kolkata",
      },
    };

    const response = await addEvent(user, event);
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(400).json(err.response?.data || err.message);
  }
};

export const getEvents = async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(401).json({ message: "Login required" });
    }

    const events = await fetchEvents(user);
    res.json(events || []);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: err.response?.data || err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(401).json({ message: "Login required" });
    }

    const { id } = req.params;
    const { title, description, start, end } = req.body;

    if (!title || !start || !end) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const event = {
      summary: title,
      description,
      start: {
        dateTime: start,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: end,
        timeZone: "Asia/Kolkata",
      },
    };

    const response = await import("../services/calendar.service.js").then((service) =>
      service.updateEvent(user, id, event)
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(400).json(err.response?.data || err.message);
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(401).json({ message: "Login required" });
    }

    const { id } = req.params;
    
    await import("../services/calendar.service.js").then((service) =>
      service.deleteEvent(user, id)
    );
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(400).json(err.response?.data || err.message);
  }
};
