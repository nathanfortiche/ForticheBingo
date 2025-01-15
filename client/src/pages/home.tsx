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
      link.download = "new-year-bingo.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      toast({
        title: "Success!",
        description: "Your bingo card has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-amber-500 mb-4">
            New Year's Resolution Bingo
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Create your personalized bingo card with your New Year's resolutions.
            Fill in your goals, choose a grid size, and download your custom bingo
            card!
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
              >
                Edit Resolutions
              </Button>
              <Button
                onClick={handleExport}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
              >
                Download Bingo Card
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
