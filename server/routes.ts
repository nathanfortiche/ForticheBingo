import type { Express } from "express";
import { createServer, type Server } from "http";
import { resolutionsHandler, updateResolutionHandler } from "./api";

export function registerRoutes(app: Express): Server {
  // Admin route with hardcoded URL for security through obscurity
  app.get("/api/admin4768932/status", (_req, res) => {
    res.json({ message: "Admin access granted" });
  });

  // Get all resolutions
  app.get("/api/admin4768932/resolutions", resolutionsHandler);

  // Update resolution status
  app.put("/api/admin4768932/resolutions/:id", updateResolutionHandler);

  const httpServer = createServer(app);
  return httpServer;
}