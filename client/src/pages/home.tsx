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
        backgroundColor: "#FFFFFF",
        scale: 3, // Increased scale for better quality
        logging: false,
        useCORS: true,
        removeContainer: true,
        onclone: (clonedDoc) => {
          // Ensure proper styling in the cloned element
          const clonedElement = clonedDoc.getElementById("bingo-card");
          if (clonedElement) {
            clonedElement.style.transform = "none";
            clonedElement.style.width = "max-content";
            clonedElement.style.margin = "0";
            // Force white background
            clonedElement.style.backgroundColor = "#FFFFFF";
          }
        }
      });

      // Create a temporary canvas with padding
      const tempCanvas = document.createElement('canvas');
      const padding = 40; // Add 40px padding
      tempCanvas.width = canvas.width + (padding * 2);
      tempCanvas.height = canvas.height + (padding * 2);
      const ctx = tempCanvas.getContext('2d');
      if (ctx) {
        // Fill white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        // Draw original canvas with padding
        ctx.drawImage(canvas, padding, padding);
      }

      const link = document.createElement("a");
      link.download = "bingo-2024.png";
      link.href = tempCanvas.toDataURL("image/png", 1.0);
      link.click();

      toast({
        title: "Téléchargement réussi",
        description: "Votre carte de bingo a été sauvegardée",
      });
    } catch (error) {
      console.error('Export error:', error);
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