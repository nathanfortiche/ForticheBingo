import { useState, useEffect } from "react";
import ResolutionForm from "@/components/resolution-form";
import BingoCard from "@/components/bingo-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { Shuffle } from "lucide-react";
import { motion } from "framer-motion";

export type Resolution = {
  id: string;
  text: string;
};

export type GridSize = "3x3" | "3x4" | "4x4" | "5x5";

type SavedBingoState = {
  resolutions: Resolution[];
  gridSize: GridSize;
  showPreview: boolean;
};

export default function Home() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [gridSize, setGridSize] = useState<GridSize>("3x3");
  const [showPreview, setShowPreview] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const { toast } = useToast();

  // Load saved state on mount
  useEffect(() => {
    const savedState = localStorage.getItem('bingoState');
    if (savedState) {
      const { resolutions: savedResolutions, gridSize: savedGridSize, showPreview: savedShowPreview } = JSON.parse(savedState) as SavedBingoState;
      setResolutions(savedResolutions);
      setGridSize(savedGridSize);
      setShowPreview(savedShowPreview);
    }
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (resolutions.length > 0) {
      const stateToSave: SavedBingoState = {
        resolutions,
        gridSize,
        showPreview,
      };
      localStorage.setItem('bingoState', JSON.stringify(stateToSave));
    }
  }, [resolutions, gridSize, showPreview]);

  const handleExport = async () => {
    const element = document.getElementById("bingo-card");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = "bingo-2024.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Téléchargement réussi",
        description: "Votre carte de bingo a été sauvegardée",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'exporter l'image. Réessayez.",
        variant: "destructive",
      });
    }
  };

  const handleShuffle = () => {
    setShuffleCount(prev => prev + 1);
    toast({
      title: "Bingo mélangé",
      description: "Les objectifs ont été réorganisés aléatoirement",
    });
  };

  const handleReset = () => {
    localStorage.removeItem('bingoState');
    localStorage.removeItem('bingoCheckedCells');
    localStorage.removeItem('bingoStatusMap');
    setResolutions([]);
    setGridSize("3x3");
    setShowPreview(false);
    setShuffleCount(0);
    toast({
      title: "Bingo réinitialisé",
      description: "Vous pouvez maintenant créer un nouveau bingo",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">
            Créez votre bingo des résolutions
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Transformez vos résolutions du Nouvel An en un Bingo
          </p>
        </div>

        {!showPreview ? (
          <ResolutionForm
            onSubmit={(data) => {
              setResolutions(data.resolutions);
              setGridSize(data.gridSize);
              setShowPreview(true);
            }}
          />
        ) : (
          <div className="max-w-3xl mx-auto">
            <BingoCard
              key={shuffleCount}
              resolutions={resolutions}
              gridSize={gridSize}
              onShuffle={handleShuffle}
            />
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleReset}
                className="text-gray-600"
              >
                Nouveau bingo
              </Button>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={handleShuffle}
                  className="bg-white hover:bg-gray-50"
                  size="icon"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
              </motion.div>
              <Button
                onClick={handleExport}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Télécharger
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}