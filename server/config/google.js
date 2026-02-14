import { google } from "googleapis";
import { env } from "./env.js";

export const oauth2Client = new google.auth.OAuth2(
  env.CLIENT_ID,
  env.CLIENT_SECRET,
  env.REDIRECT_URI
);

export const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});
