import { type Request, Response } from "express";

export default function handler(req: Request, res: Response) {
  if (req.method === 'PUT') {
    try {
      const { text, status } = req.body;
      return res.status(200).json({ message: "Updated successfully", text, status });
    } catch (error) {
      console.error('Error updating resolution:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
