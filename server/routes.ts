import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Admin route with hardcoded URL for security through obscurity
  app.get("/api/admin4768932/status", (_req, res) => {
    res.json({ message: "Admin access granted" });
  });

  // Get all resolutions
  app.get("/api/admin4768932/resolutions", (_req, res) => {
    // Mock data with user's personal objectives
    const mockResolutions = [
      { id: 1, text: "Perdre 5kg", status: "Pas commencé", position: 0 },
      { id: 2, text: "Courir un semi-marathon", status: "Pas commencé", position: 1 },
      { id: 3, text: "Apprendre le piano", status: "Pas commencé", position: 2 },
      { id: 4, text: "Voyager au Japon", status: "Pas commencé", position: 3 },
      { id: 5, text: "Lire 12 livres", status: "Pas commencé", position: 4 },
      { id: 6, text: "Méditer 10 minutes par jour", status: "Pas commencé", position: 5 },
      { id: 7, text: "Économiser 5000€", status: "Pas commencé", position: 6 },
      { id: 8, text: "Apprendre à cuisiner 5 plats", status: "Pas commencé", position: 7 },
      { id: 9, text: "Obtenir une promotion", status: "Pas commencé", position: 8 }
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