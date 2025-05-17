import { users, settings, servers, type User, type InsertUser, type Settings, type InsertSettings, type Server, type InsertServer } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByDiscordId(discordId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;
  
  getServers(): Promise<Server[]>;
  getServer(id: number): Promise<Server | undefined>;
  createServer(server: InsertServer): Promise<Server>;
  updateServer(id: number, server: Partial<InsertServer>): Promise<Server | undefined>;
  
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private settings: Settings | undefined;
  private servers: Map<number, Server>;
  private currentUserId: number;
  private currentServerId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.servers = new Map();
    this.currentUserId = 1;
    this.currentServerId = 1;
    
    // Default admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$OdWiMQX2EH/eXLmuG/gR9.UYS9wSVTx4OLwEylJjgqZeQJg8dSnYi", // "password"
      isAdmin: true,
    });
    
    // Default settings
    this.settings = {
      id: 1,
      dashboardName: "MinePanel",
      skyportApiKey: "",
      skyportApiUrl: "https://skyport.panel/api",
    };
    
    // Sample servers for development
    this.createServer({
      name: "Survival Server",
      identifier: "survival",
      address: "mc.example.com:25565",
      status: "online",
      players: 24,
      maxPlayers: 50,
      memory: "2.1 GB",
      uptime: "3d 7h 22m",
    });
    
    this.createServer({
      name: "Creative Server",
      identifier: "creative",
      address: "creative.example.com:25565",
      status: "online",
      players: 12,
      maxPlayers: 30,
      memory: "1.5 GB",
      uptime: "5d 12h 47m",
    });
    
    this.createServer({
      name: "SkyBlock Server",
      identifier: "skyblock",
      address: "skyblock.example.com:25565",
      status: "offline",
      players: 0,
      maxPlayers: 40,
      memory: "2.0 GB",
      uptime: "0d 0h 0m",
    });
    
    // Initialize session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByDiscordId(discordId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.discordId === discordId,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser = { ...existingUser, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async getSettings(): Promise<Settings | undefined> {
    return this.settings;
  }
  
  async updateSettings(settingsData: Partial<InsertSettings>): Promise<Settings> {
    if (!this.settings) {
      this.settings = {
        id: 1,
        dashboardName: "MinePanel",
        skyportApiKey: "",
        skyportApiUrl: "https://skyport.panel/api",
        ...settingsData,
      };
    } else {
      this.settings = { ...this.settings, ...settingsData };
    }
    return this.settings;
  }
  
  async getServers(): Promise<Server[]> {
    return Array.from(this.servers.values());
  }
  
  async getServer(id: number): Promise<Server | undefined> {
    return this.servers.get(id);
  }
  
  async createServer(serverData: InsertServer): Promise<Server> {
    const id = this.currentServerId++;
    const server: Server = { ...serverData, id, lastSeen: new Date() };
    this.servers.set(id, server);
    return server;
  }
  
  async updateServer(id: number, serverData: Partial<InsertServer>): Promise<Server | undefined> {
    const existingServer = this.servers.get(id);
    if (!existingServer) return undefined;
    
    const updatedServer = { ...existingServer, ...serverData };
    this.servers.set(id, updatedServer);
    return updatedServer;
  }
}

export const storage = new MemStorage();
