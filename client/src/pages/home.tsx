import { useState } from "react";
import ResolutionForm from "@/components/resolution-form";
import BingoCard from "@/components/bingo-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

export type Resolution = {
  id: string;
  text: string;
};

export type GridSize = "3x3" | "4x4";

export default function Home() {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [gridSize, setGridSize] = useState<GridSize>("3x3");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    const element = document.getElementById("bingo-card");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement("a");
      link.download = "bingo-resolutions.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Succès !",
        description: "Votre carte de bingo a été téléchargée.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de l'exportation. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-800 mb-4">
            Bingo des Résolutions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto font-light">
            Créez votre carte de bingo personnalisée avec vos résolutions du Nouvel An.
            Ajoutez vos objectifs, choisissez une taille de grille, et téléchargez votre
            carte personnalisée !
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
              resolutions={resolutions}
              gridSize={gridSize}
            />
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="text-gray-700"
              >
                Modifier les Résolutions
              </Button>
              <Button
                onClick={handleExport}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                Télécharger la Carte
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}