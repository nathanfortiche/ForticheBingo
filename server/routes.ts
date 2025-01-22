import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Admin route with hardcoded URL for security through obscurity
  app.get("/api/admin4768932/status", (_req, res) => {
    res.json({ message: "Admin access granted" });
  });

  // Get all resolutions
  app.get("/api/admin4768932/resolutions", (_req, res) => {
    // Mock data since we're not using a database
    const mockResolutions = [
      { id: 1, text: "Faire du sport régulièrement", status: "En cours", position: 0 },
      { id: 2, text: "Apprendre une nouvelle langue", status: "Pas commencé", position: 1 },
      { id: 3, text: "Voyager dans un nouveau pays", status: "Pas commencé", position: 2 },
      { id: 4, text: "Lire 12 livres", status: "En cours", position: 3 },
    ];
    res.json(mockResolutions);
  });

  // Update resolution status
  app.put("/api/admin4768932/resolutions/:id", (req, res) => {
    try {
      const { status } = req.body;
      // Here we would update the resolution status
      // For now just return success since we're not using a database
      res.json({ message: "Updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating resolution" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}