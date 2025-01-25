import { type Request, Response } from "express";

export default function handler(req: Request, res: Response) {
  if (req.method === 'GET') {
    try {
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

      return res.status(200).json(mockResolutions);
    } catch (error) {
      console.error('Error fetching resolutions:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}