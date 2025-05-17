import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { setupDiscordAuth } from "./authDiscord";
import { setupSkyportApi } from "./skyportApi";

// Middleware for checking admin permissions
function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Not authorized" });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  setupDiscordAuth(app);
  
  // Get dashboard settings
  app.get('/api/settings', async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error('Error fetching settings:', error);
      res.status(500).json({ message: 'Error fetching settings' });
    }
  });
  
  // Update dashboard settings (admin only)
  app.post('/api/settings', isAdmin, async (req, res) => {
    try {
      const { dashboardName, skyportApiKey, skyportApiUrl } = req.body;
      const updatedSettings = await storage.updateSettings({
        dashboardName, 
        skyportApiKey, 
        skyportApiUrl
      });
      res.json(updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ message: 'Error updating settings' });
    }
  });
  
  // Get all servers
  app.get('/api/servers', async (req, res) => {
    try {
      const servers = await storage.getServers();
      res.json(servers);
    } catch (error) {
      console.error('Error fetching servers:', error);
      res.status(500).json({ message: 'Error fetching servers' });
    }
  });
  
  // Get single server
  app.get('/api/servers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const server = await storage.getServer(id);
      
      if (!server) {
        return res.status(404).json({ message: 'Server not found' });
      }
      
      res.json(server);
    } catch (error) {
      console.error('Error fetching server:', error);
      res.status(500).json({ message: 'Error fetching server' });
    }
  });
  
  // Skyport API integration routes
  setupSkyportApi(app, isAdmin);
  
  const httpServer = createServer(app);

  return httpServer;
}
