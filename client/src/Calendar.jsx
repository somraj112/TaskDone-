import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./Calendar.css";

export default function Calendar() {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
  });

  // Fetch events from Google Calendar
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/calendar/events");
      
      if (!res.ok) {
        throw new Error("Failed to fetch events");
      }

      const data = await res.json();
      
      // Transform Google Calendar events to FullCalendar format
      const transformedEvents = data.map((event) => ({
        id: event.id,
        title: event.summary || "Untitled Event",
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: event.description || "",
      }));

      setEvents(transformedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please login first.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (info) => {
    // Convert ISO string to datetime-local format (YYYY-MM-DDThh:mm)
    const formatForInput = (isoString) => {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setEventData({
      title: "",
      description: "",
      start: formatForInput(info.startStr),
      end: formatForInput(info.endStr),
    });
    setSelectedEventId(null);
    setShowModal(true);
    setError("");
  };

  const handleAddEventClick = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    // Format for datetime-local input
    const formatForInput = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    setEventData({
      title: "",
      description: "",
      start: formatForInput(now),
      end: formatForInput(oneHourLater),
    });
    setSelectedEventId(null);
    setShowModal(true);
    setError("");
  };

  const handleEditClick = (event) => {
    const formatForInput = (date) => {
        if (!date) return "";
        // date is already a Date object from FullCalendar
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    setEventData({
        title: event.title,
        description: event.extendedProps.description,
        start: formatForInput(event.start),
        end: formatForInput(event.end),
    });
    setSelectedEventId(event.id);
    setShowModal(true);
    setError("");
  };


  const handleDeleteClick = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
        const res = await fetch(`http://localhost:5001/api/calendar/delete/${eventId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || "Failed to delete event");
        }

        await fetchEvents();
    } catch (err) {
        console.error("Error deleting event:", err);
        alert(err.message || "Failed to delete event");
    }
  };


  const createOrUpdateEvent = async () => {
    if (!eventData.title.trim()) {
      setError("Event title is required");
      return;
    }

    if (!eventData.start || !eventData.end) {
      setError("Start and end times are required");
      return;
    }

    try {
      // Convert datetime-local format to ISO string
      const eventPayload = {
        title: eventData.title,
        description: eventData.description,
        start: new Date(eventData.start).toISOString(),
        end: new Date(eventData.end).toISOString(),
      };

      const url = selectedEventId 
        ? `http://localhost:5001/api/calendar/update/${selectedEventId}`
        : "http://localhost:5001/api/calendar/add";
      
      const method = selectedEventId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save event");
      }

      // Close modal and refresh events
      setShowModal(false);
      setError("");
      await fetchEvents();
    } catch (err) {
      console.error("Error saving event:", err);
      setError(err.message || "Failed to save event");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError("");
    setSelectedEventId(null);
  };

  const renderEventContent = (eventInfo) => {
    return (
        <>
            <div className="fc-event-main-frame">
                <div className="fc-event-time">{eventInfo.timeText}</div>
                <div className="fc-event-title-container">
                    <div className="fc-event-title fc-sticky">
                        {eventInfo.event.title}
                    </div>
                    {eventInfo.event.extendedProps.description && (
                        <div className="fc-event-description">
                            {eventInfo.event.extendedProps.description}
                        </div>
                    )}
                </div>
            </div>
            <div className="event-actions">
                <button 
                    className="action-btn edit" 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(eventInfo.event);
                    }}
                    title="Edit"
                >
                    ✏️
                </button>
                <button 
                    className="action-btn delete" 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(eventInfo.event.id);
                    }}
                    title="Delete"
                >
                    🗑️
                </button>
            </div>
        </>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1 className="calendar-title">📅 TaskDone Calendar</h1>
        <button onClick={handleAddEventClick} className="add-event-btn">
          <span>➕</span> Add Event
        </button>
      </div>

      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          selectable={true}
          select={handleSelect}
          events={events}
          eventContent={renderEventContent}
          height="100%"
          slotMinTime="06:00:00"
          slotMaxTime="24:00:00"
          allDaySlot={false}
          nowIndicator={true}
        />
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedEventId ? "Edit Event" : "Create Event"}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ✕
              </button>
            </div>

            {error && (
              <div className="error-message">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter event title"
                  value={eventData.title}
                  onChange={(e) =>
                    setEventData({ ...eventData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter event description (optional)"
                  value={eventData.description}
                  onChange={(e) =>
                    setEventData({
                      ...eventData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Time *</label>
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={eventData.start}
                    onChange={(e) =>
                      setEventData({ ...eventData, start: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Time *</label>
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={eventData.end}
                    onChange={(e) =>
                      setEventData({ ...eventData, end: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="submit"
                  onClick={createOrUpdateEvent}
                  className="btn btn-primary"
                >
                  {selectedEventId ? "Save Changes" : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
