import React, { useState, useEffect } from "react";
import Calendar from "./Calendar.jsx";
import "./App.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/calendar/events");
      setIsAuthenticated(res.ok);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <div className="login-container">
          <h1 className="login-title">📅 TaskDone</h1>
          <p className="login-subtitle">
            Manage your tasks and events with Google Calendar integration
          </p>
          <a
            href="http://localhost:5001/auth/google"
            className="login-button"
          >
            <span>🔐</span> Login with Google
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Calendar />
    </div>
  );
}
