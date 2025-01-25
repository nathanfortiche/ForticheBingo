import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Admin route with hardcoded URL for security through obscurity
  app.get("/api/admin4768932/status", (_req, res) => {
    try {
      console.log("[API] Accessing admin status");
      res.json({ message: "Admin access granted" });
    } catch (error) {
      console.error('Admin status error:', error);
      res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  // Get all resolutions
  app.get("/api/admin4768932/resolutions", (_req, res) => {
    try {
      console.log("[API] Fetching all resolutions");
      const mockResolutions = [
        { id: 1, text: "100k abonnés tiktok", status: "60,9k", position: 0 },
        { id: 2, text: "Créer une app/un site que des gens utilisent", status: "3 apps commencées, aucune publiée", position: 1 },
        { id: 3, text: "120kg développé couché", status: "100kg (juillet 2024)", position: 2 },
        { id: 4, text: "Faire une collab avec un musée/un magazine", status: "Pas commencé", position: 3 },
        { id: 5, text: "130 séances de sport", status: "5", position: 4 },
        { id: 6, text: "Apprendre des pas de danse", status: "Pas commencé", position: 5 },
        { id: 7, text: "120 films vus", status: "3", position: 6 },
        { id: 8, text: "10 livres finis", status: "0", position: 7 },
        { id: 9, text: "Faire un tatouage", status: "Plein d'idées, bcp d'hésitation", position: 8 },
        { id: 10, text: "Faire/Planifier un voyage vers un pote expatrié", status: "Pas commencé", position: 9 },
        { id: 11, text: "Faire 1 vidéo long format bien réalisée (20+ minutes)", status: "Pas commencé", position: 10 },
        { id: 12, text: "100kg squat", status: "80kg (janv 2025)", position: 11 },
        { id: 13, text: "20k abonnés insta", status: "8816", position: 12 },
        { id: 14, text: "Passer le permis", status: "3 échecs, plus le code", position: 13 },
        { id: 15, text: "Monter 5 nouveaux decks magic", status: "1 en cours", position: 14 },
        { id: 16, text: "Diamant soloQ", status: "Plat 1", position: 15 }
      ];
      res.json({ data: mockResolutions });
    } catch (error) {
      console.error('Get resolutions error:', error);
      res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  // Get bingo-2025 data
  app.get("/api/bingo-2025", (_req, res) => {
    try {
      console.log("[API] Fetching bingo-2025 data");
      res.json({
        data: {
          title: "Mon Bingo 2025",
          subtitle: "Suivez l'évolution de mes résolutions pour 2025",
          grid: [
            ["100k tiktok", "App utilisée", "120kg DC", "Collab musée"],
            ["130 séances", "Danse", "120 films", "10 livres"],
            ["Tatouage", "Voyage pote", "Vidéo 20min", "100kg squat"],
            ["20k insta", "Permis", "5 decks MTG", "Diamant LoL"]
          ]
        }
      });
    } catch (error) {
      console.error('Get bingo data error:', error);
      res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  // Update resolution status
  app.put("/api/admin4768932/resolutions/:id", (req, res) => {
    try {
      console.log("[API] Updating resolution status", req.params.id);
      const { text, status } = req.body;
      res.json({ message: "Updated successfully", data: { text, status } });
    } catch (error) {
      console.error('Update resolution error:', error);
      res.status(500).json({ message: "Error updating resolution" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Make sure to export both as default and named export for maximum compatibility
export { registerRoutes as default };