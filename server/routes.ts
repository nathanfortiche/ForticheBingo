import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { personalResolutions } from "@db/schema";
import { eq } from "drizzle-orm";

export function registerRoutes(app: Express): Server {
  // Get personal resolutions
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

  // Update resolution status (protected route)
  app.put("/api/personal-resolutions/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      await db
        .update(personalResolutions)
        .set({ 
          status,
          updatedAt: new Date(),
        })
        .where(eq(personalResolutions.id, parseInt(id)));

      res.json({ message: "Status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}