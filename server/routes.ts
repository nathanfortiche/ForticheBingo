import type { Express } from "express";
import { createServer, type Server } from "http";

export function registerRoutes(app: Express): Server {
  // Get bingo-2025 data with static content
  app.get("/api/bingo-2025", (_req, res) => {
    try {
      res.json({
        data: {
          title: "Mon Bingo 2025",
          subtitle: "Suivez l'évolution de mes résolutions pour 2025",
          grid: [
            [
              { text: "100k tiktok", status: "60,9k" },
              { text: "App utilisée", status: "3 apps commencées, aucune publiée" },
              { text: "120kg DC", status: "100kg (juillet 2024)" },
              { text: "Collab musée", status: "Pas commencé" }
            ],
            [
              { text: "130 séances", status: "5" },
              { text: "Danse", status: "Pas commencé" },
              { text: "120 films", status: "3" },
              { text: "10 livres", status: "0" }
            ],
            [
              { text: "Tatouage", status: "Plein d'idées, bcp d'hésitation" },
              { text: "Voyage pote", status: "Pas commencé" },
              { text: "Vidéo 20min", status: "Pas commencé" },
              { text: "100kg squat", status: "80kg (janv 2025)" }
            ],
            [
              { text: "20k insta", status: "8816" },
              { text: "Permis", status: "3 échecs, plus le code" },
              { text: "5 decks MTG", status: "1 en cours" },
              { text: "Diamant LoL", status: "Plat 1" }
            ]
          ]
        }
      });
    } catch (error) {
      console.error('Get bingo data error:', error);
      res.status(500).json({ message: "Internal server error", error: String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}