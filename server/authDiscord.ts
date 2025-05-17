import passport from "passport";
import { Strategy as DiscordStrategy } from "passport-discord";
import { Express } from "express";
import { storage } from "./storage";

export function setupDiscordAuth(app: Express) {
  // Get Discord OAuth credentials from environment variables
  const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const DISCORD_CALLBACK_URL = process.env.DISCORD_CALLBACK_URL || "http://localhost:5000/api/auth/discord/callback";
  
  // Get admin Discord IDs from environment variables (comma-separated list)
  const ADMIN_DISCORD_IDS = (process.env.ADMIN_DISCORD_IDS || "").split(",").filter(Boolean);
  
  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    console.warn("Discord OAuth credentials not provided. Discord authentication will not be available.");
    return;
  }
  
  // Configure Discord strategy
  passport.use(
    new DiscordStrategy(
      {
        clientID: DISCORD_CLIENT_ID,
        clientSecret: DISCORD_CLIENT_SECRET,
        callbackURL: DISCORD_CALLBACK_URL,
        scope: ["identify", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user exists in database
          let user = await storage.getUserByDiscordId(profile.id);
          
          // If user doesn't exist, create one
          if (!user) {
            // Check if this Discord ID should be an admin
            const isAdmin = ADMIN_DISCORD_IDS.includes(profile.id);
            
            user = await storage.createUser({
              username: profile.username,
              discordId: profile.id,
              discordUsername: profile.username,
              discordAvatar: profile.avatar,
              email: profile.email,
              isAdmin,
            });
          } else {
            // Update existing user with latest Discord info
            user = await storage.updateUser(user.id, {
              discordUsername: profile.username,
              discordAvatar: profile.avatar,
              email: profile.email,
            });
          }
          
          return done(null, user);
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );
  
  // Discord authentication routes
  app.get(
    "/api/auth/discord",
    passport.authenticate("discord")
  );
  
  app.get(
    "/api/auth/discord/callback",
    passport.authenticate("discord", {
      failureRedirect: "/auth?error=discord-auth-failed",
    }),
    (req, res) => {
      // Successful authentication, redirect to dashboard
      res.redirect("/dashboard");
    }
  );
}
