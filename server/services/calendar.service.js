import { calendar, oauth2Client } from "../config/google.js";

export async function addEvent(user, eventData) {
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  return calendar.events.insert({
    calendarId: "primary",
    resource: eventData,
  });
}

export async function fetchEvents(user) {
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const response = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.data.items;
}

export async function updateEvent(user, eventId, eventData) {
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  return calendar.events.update({
    calendarId: "primary",
    eventId: eventId,
    resource: eventData,
  });
}

export async function deleteEvent(user, eventId) {
  oauth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  return calendar.events.delete({
    calendarId: "primary",
    eventId: eventId,
  });
}
