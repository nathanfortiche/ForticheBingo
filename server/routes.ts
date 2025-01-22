import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";

export function registerRoutes(app: Express): Server {
  // Set up authentication
  setupAuth(app);

  const httpServer = createServer(app);
  return httpServer;
}