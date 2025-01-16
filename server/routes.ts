import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { personalResolutions } from "@db/schema";
import { eq } from "drizzle-orm";
import { setupAuth } from "./auth";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

export function registerRoutes(app: Express): Server {
  // Set up authentication
  setupAuth(app);

  // Get personal resolutions (public route)
  app.get("/api/personal-resolutions", async (_req, res) => {
    try {
      const resolutions = await db.query.personalResolutions.findMany({
        orderBy: (personalResolutions, { asc }) => [asc(personalResolutions.position)],
      });
      res.json(resolutions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching resolutions" });
    }
  });

  // Update resolution text and status (protected route)
  app.put("/api/personal-resolutions/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { status, text } = req.body;

    try {
      await db
        .update(personalResolutions)
        .set({ 
          ...(status && { status }),
          ...(text && { text }),
          updatedAt: new Date(),
        })
        .where(eq(personalResolutions.id, parseInt(id)));

      res.json({ message: "Updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}