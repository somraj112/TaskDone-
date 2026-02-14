import { oauth2Client } from "../config/google.js";
import { User } from "../models/user.model.js";

export async function saveTokens(profile, tokens) {
  return User.findOneAndUpdate(
    { googleId: profile.sub },
    {
      googleId: profile.sub,
      email: profile.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    },
    { upsert: true, new: true }
  );
}
