import { oauth2Client } from "../config/google.js";
import { saveTokens } from "../services/googleAuth.service.js";
import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "openid",
  "email",
  "profile",
];

export const login = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent", // IMPORTANT for refresh token
  });
  res.redirect(url);
};

export const callback = async (req, res) => {
  try {
    // 1️⃣ Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(req.query.code);

    // 2️⃣ Attach tokens to the OAuth client
    oauth2Client.setCredentials(tokens);

    // 3️⃣ Create OAuth2 API WITH authenticated client
    const oauth2 = google.oauth2({
      version: "v2",
      auth: oauth2Client,
    });

    // 4️⃣ Fetch user profile (NOW token is included)
    const { data: profile } = await oauth2.userinfo.get();

    // 5️⃣ Save user + tokens
    await saveTokens(profile, tokens);

    // 6️⃣ Redirect to frontend
    res.redirect("http://localhost:5173");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("Google authentication failed");
  }
};
