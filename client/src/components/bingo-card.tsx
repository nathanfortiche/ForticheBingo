import { useState, useEffect } from "react";
import { Resolution, GridSize } from "@/pages/home";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import confetti from "canvas-confetti";

type Props = {
  resolutions: Resolution[];
  gridSize: GridSize;
};

type StatusMap = {
  [key: string]: string;
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function BingoCard({ resolutions, gridSize }: Props) {
  const [shuffledResolutions, setShuffledResolutions] = useState<Resolution[]>([]);
  const [checkedCells, setCheckedCells] = useState<Set<string>>(new Set());
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [selectedResolution, setSelectedResolution] = useState<Resolution | null>(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setShuffledResolutions(shuffleArray(resolutions));
  }, [resolutions]);

  const getGridDimensions = (size: GridSize) => {
    switch (size) {
      case "3x3": return { rows: 3, cols: 3 };
      case "3x4": return { rows: 3, cols: 4 };
      case "4x4": return { rows: 4, cols: 4 };
      default: return { rows: 3, cols: 3 };
    }
  };

  const { rows, cols } = getGridDimensions(gridSize);
  const cellCount = rows * cols;

  const triggerConfetti = () => {
    const duration = 3000;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = duration - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const toggleCell = (id: string) => {
    const newCheckedCells = new Set(checkedCells);
    if (newCheckedCells.has(id)) {
      newCheckedCells.delete(id);
    } else {
      newCheckedCells.add(id);

      // Check if all cells are checked after adding new one
      if (newCheckedCells.size === cellCount) {
        triggerConfetti();
      }
    }
    setCheckedCells(newCheckedCells);
  };

  const handleStatusUpdate = () => {
    if (selectedResolution && currentStatus.trim()) {
      setStatusMap(prev => ({
        ...prev,
        [selectedResolution.id]: currentStatus.trim()
      }));
      setSelectedResolution(null);
      setCurrentStatus("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div
      id="bingo-card"
      className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">
          Bingo 2024
        </h2>
        <div className="h-[2px] w-12 bg-primary mx-auto opacity-50" />
      </div>

      <div
        className={`grid gap-3`}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {shuffledResolutions.slice(0, cellCount).map((resolution) => (
          <Dialog 
            key={resolution.id} 
            open={isDialogOpen && selectedResolution?.id === resolution.id}
            onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (open) {
                setSelectedResolution(resolution);
                setCurrentStatus(statusMap[resolution.id] || "");
              } else {
                setSelectedResolution(null);
                setCurrentStatus("");
              }
            }}
          >
            <DialogTrigger asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <Card 
                  className={`p-4 min-h-[120px] flex flex-col items-center justify-center text-center transition-all duration-200 border-gray-100 cursor-pointer
                    ${checkedCells.has(resolution.id) 
                      ? 'bg-gray-50 border-primary/50' 
                      : 'hover:bg-gray-50/50'}`}
                  onClick={() => toggleCell(resolution.id)}
                >
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {resolution.text}
                  </p>
                  {statusMap[resolution.id] && (
                    <p className="mt-2 text-xs text-gray-400 italic">
                      {statusMap[resolution.id]}
                    </p>
                  )}
                </Card>
              </motion.div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mise à jour du statut</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Résolution</Label>
                  <p className="text-sm text-gray-600">{resolution.text}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut actuel</Label>
                  <Input
                    id="status"
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    placeholder="Ex: J'ai commencé à courir 2 fois par semaine"
                  />
                </div>
                <Button onClick={handleStatusUpdate} className="w-full">
                  Enregistrer le statut
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-gray-500">
          Cliquez sur une résolution pour ajouter un statut
        </p>
      </div>
    </div>
  );
}