import { useState } from "react";
import ResolutionForm from "@/components/resolution-form";
import BingoCard from "@/components/bingo-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import { Shuffle } from "lucide-react";

export type Resolution = {
  id: string;
  text: string;
};

export type GridSize = "3x3" | "3x4" | "4x4";

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
              resolutions={resolutions}
              gridSize={gridSize}
            />
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="text-gray-600"
              >
                Modifier
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const element = document.querySelector("#bingo-card .grid") as HTMLElement;
                  if (element) {
                    const items = Array.from(element.children);
                    const shuffled = items.sort(() => Math.random() - 0.5);
                    shuffled.forEach(item => element.appendChild(item));
                  }
                }}
                size="icon"
                className="w-10 h-10 export-hide"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
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