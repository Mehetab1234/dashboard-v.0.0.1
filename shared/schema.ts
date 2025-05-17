import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  email: text("email"),
  discordId: text("discord_id").unique(),
  discordUsername: text("discord_username"),
  discordAvatar: text("discord_avatar"),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  dashboardName: text("dashboard_name").default("CRAZEDASH").notNull(),
  skyportApiKey: text("skyport_api_key"),
  skyportApiUrl: text("skyport_api_url").default("https://skyport.panel/api"),
});

export const servers = pgTable("servers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  identifier: text("identifier").notNull(),
  address: text("address").notNull(),
  status: text("status").default("offline").notNull(),
  players: integer("players").default(0),
  maxPlayers: integer("max_players").default(0),
  memory: text("memory"),
  uptime: text("uptime"),
  lastSeen: timestamp("last_seen"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  discordId: true,
  discordUsername: true,
  discordAvatar: true,
  isAdmin: true,
});

export const insertSettingsSchema = createInsertSchema(settings).pick({
  dashboardName: true,
  skyportApiKey: true,
  skyportApiUrl: true,
});

export const insertServerSchema = createInsertSchema(servers).pick({
  name: true,
  identifier: true,
  address: true,
  status: true,
  players: true,
  maxPlayers: true,
  memory: true,
  uptime: true,
  lastSeen: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export type InsertServer = z.infer<typeof insertServerSchema>;
export type Server = typeof servers.$inferSelect;

export type Node = {
  id: number;
  name: string;
  location: string;
  fqdn: string;
  memory: number;
  memoryUsed: number;
  disk: number;
  diskUsed: number;
  servers: number;
  status: string;
};

export type Egg = {
  id: number;
  name: string;
  description: string;
  nest: string;
  dockerImage: string;
  startup: string;
};
