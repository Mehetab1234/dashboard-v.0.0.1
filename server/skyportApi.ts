import { Express, Request, Response } from "express";
import { storage } from "./storage";
import axios from "axios";
import { Node, Egg } from "@shared/schema";

export function setupSkyportApi(app: Express, isAdmin: (req: Request, res: Response, next: Function) => void) {
  // Get nodes from Skyport Panel API
  app.get('/api/skyport/nodes', isAdmin, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      
      if (!settings?.skyportApiKey) {
        return res.status(400).json({ message: 'Skyport API key not configured' });
      }
      
      const apiUrl = settings.skyportApiUrl || 'https://skyport.panel/api';
      
      // Make request to Skyport API
      const response = await axios.get(`${apiUrl}/application/nodes`, {
        headers: {
          'Authorization': `Bearer ${settings.skyportApiKey}`,
          'Accept': 'application/json',
        }
      });
      
      // Transform response data to match our schema
      const nodes: Node[] = response.data.data.map((node: any) => ({
        id: node.attributes.id,
        name: node.attributes.name,
        location: node.attributes.location || 'Unknown',
        fqdn: node.attributes.fqdn,
        memory: node.attributes.memory,
        memoryUsed: node.attributes.memory_allocated || 0,
        disk: node.attributes.disk,
        diskUsed: node.attributes.disk_allocated || 0,
        servers: node.attributes.server_count || 0,
        status: node.attributes.status || 'unknown',
      }));
      
      res.json(nodes);
    } catch (error) {
      console.error('Error fetching Skyport nodes:', error);
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({ 
          message: `Skyport API error: ${error.response.statusText}`,
          details: error.response.data
        });
      } else {
        res.status(500).json({ message: 'Error fetching nodes from Skyport API' });
      }
    }
  });
  
  // Get eggs from Skyport Panel API
  app.get('/api/skyport/eggs', isAdmin, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      
      if (!settings?.skyportApiKey) {
        return res.status(400).json({ message: 'Skyport API key not configured' });
      }
      
      const apiUrl = settings.skyportApiUrl || 'https://skyport.panel/api';
      
      // Make request to Skyport API
      const response = await axios.get(`${apiUrl}/application/nests?include=eggs`, {
        headers: {
          'Authorization': `Bearer ${settings.skyportApiKey}`,
          'Accept': 'application/json',
        }
      });
      
      // Transform response data to match our schema
      const eggs: Egg[] = [];
      
      response.data.data.forEach((nest: any) => {
        const nestName = nest.attributes.name;
        
        if (nest.attributes.eggs) {
          nest.attributes.eggs.forEach((egg: any) => {
            eggs.push({
              id: egg.id,
              name: egg.name,
              description: egg.description || '',
              nest: nestName,
              dockerImage: egg.docker_image || '',
              startup: egg.startup || '',
            });
          });
        }
      });
      
      res.json(eggs);
    } catch (error) {
      console.error('Error fetching Skyport eggs:', error);
      if (axios.isAxiosError(error) && error.response) {
        res.status(error.response.status).json({ 
          message: `Skyport API error: ${error.response.statusText}`,
          details: error.response.data
        });
      } else {
        res.status(500).json({ message: 'Error fetching eggs from Skyport API' });
      }
    }
  });
}
