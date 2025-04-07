import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import BingoCard from "@/components/bingo-card";

// Predefined resolutions for the 2025 bingo
const BINGO_RESOLUTIONS = [
  { id: "1", text: "100k tiktok" },
  { id: "2", text: "Créer un site que des gens utilisent" },
  { id: "3", text: "115kg Développé Couché" },
  { id: "4", text: "Collab avec un musée" },
  { id: "5", text: "130 séances de sport" },
  { id: "6", text: "Apprendre des pas de danse" },
  { id: "7", text: "120 films vus" },
  { id: "8", text: "10 livres finis" },
  { id: "9", text: "Faire un tatouage" },
  { id: "10", text: "Faire/Planifier un voyage vers un pote expat" },
  { id: "11", text: "Faire une vidéo YT quali (20+min)" },
  { id: "12", text: "100kg squat" },
  { id: "13", text: "20k insta" },
  { id: "14", text: "Passer le permis" },
  { id: "15", text: "5 nouveaux decks MTG" },
  { id: "16", text: "Diamant SoloQ sur LoL" }
];

export default function Bingo2025() {
  const [shuffleCount, setShuffleCount] = useState(0);

  const handleShuffle = () => {
    setShuffleCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight">
            Mon Bingo 2025
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
            Suivez l'évolution de mes résolutions pour 2025
          </p>
        </div>

        <div className="mb-8 md:mb-12">
          <BingoCard
            key={shuffleCount}
            resolutions={BINGO_RESOLUTIONS}
            gridSize="4x4"
            onShuffle={handleShuffle}
          />
        </div>

        <div className="text-center">
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
            Envie de créer votre propre bingo des résolutions ?
          </p>
          <Link href="/">
            <Button className="bg-gray-900 hover:bg-gray-800">
              Créer mon bingo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}