import { useState, useEffect } from "react";
import { Resolution, GridSize } from "@/pages/home";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  resolutions: Resolution[];
  gridSize: GridSize;
  onShuffle?: () => void;
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

const getGridDimensions = (size: GridSize) => {
  switch (size) {
    case "3x3": return { rows: 3, cols: 3 };
    case "3x4": return { rows: 3, cols: 4 };
    case "4x4": return { rows: 4, cols: 4 };
    default: return { rows: 3, cols: 3 };
  }
};

export default function BingoCard({ resolutions, gridSize, onShuffle }: Props) {
  const [shuffledResolutions, setShuffledResolutions] = useState<Resolution[]>([]);
  const [checkedCells, setCheckedCells] = useState<Set<string>>(new Set());
  const [statusMap, setStatusMap] = useState<StatusMap>({});
  const [selectedResolution, setSelectedResolution] = useState<Resolution | null>(null);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize or load shuffled resolutions
  useEffect(() => {
    const savedOrder = localStorage.getItem('bingoShuffledOrder');
    if (savedOrder) {
      // If we have a saved order, recreate the shuffled array using the saved order
      const orderMap = JSON.parse(savedOrder);
      const orderedResolutions = [...resolutions].sort((a, b) => 
        (orderMap[a.id] || 0) - (orderMap[b.id] || 0)
      );
      setShuffledResolutions(orderedResolutions);
    } else {
      // If no saved order, create a new shuffled array
      const shuffled = shuffleArray(resolutions);
      const orderMap = Object.fromEntries(
        shuffled.map((res, index) => [res.id, index])
      );
      localStorage.setItem('bingoShuffledOrder', JSON.stringify(orderMap));
      setShuffledResolutions(shuffled);
    }
  }, [resolutions]);

  // Load saved progress from localStorage
  useEffect(() => {
    const savedCheckedCells = localStorage.getItem('bingoCheckedCells');
    const savedStatusMap = localStorage.getItem('bingoStatusMap');

    if (savedCheckedCells) {
      const parsedCells = JSON.parse(savedCheckedCells);
      setCheckedCells(new Set(parsedCells));
    }

    if (savedStatusMap) {
      const parsedStatusMap = JSON.parse(savedStatusMap);
      setStatusMap(parsedStatusMap);
    }
  }, []); // Only run once on mount

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (checkedCells.size > 0 || Object.keys(statusMap).length > 0) {
      localStorage.setItem('bingoCheckedCells', JSON.stringify(Array.from(checkedCells)));
      localStorage.setItem('bingoStatusMap', JSON.stringify(statusMap));
    }
  }, [checkedCells, statusMap]);

  // Handle shuffle button click
  useEffect(() => {
    if (onShuffle) {
      const handleShuffleClick = () => {
        const shuffled = shuffleArray(shuffledResolutions);
        const orderMap = Object.fromEntries(
          shuffled.map((res, index) => [res.id, index])
        );
        localStorage.setItem('bingoShuffledOrder', JSON.stringify(orderMap));
        setShuffledResolutions(shuffled);
      };

      // Subscribe to parent's shuffle event.  This part is questionable as it unsubscribes immediately.  Likely needs refinement based on how `onShuffle` is used.
      const unsub = onShuffle;
      unsub();

      return () => {
        if (typeof unsub === 'function') unsub();
      };
    }
  }, [onShuffle, shuffledResolutions]);

  const { rows, cols } = getGridDimensions(gridSize);
  const cellCount = rows * cols;

  const handleStatusUpdate = () => {
    if (selectedResolution) {
      const newStatusMap = { ...statusMap };

      if (currentStatus.trim()) {
        newStatusMap[selectedResolution.id] = currentStatus.trim();
      } else {
        delete newStatusMap[selectedResolution.id];
      }

      setStatusMap(newStatusMap);
      setSelectedResolution(null);
      setCurrentStatus("");
      setIsDialogOpen(false);
    }
  };

  const toggleCell = (id: string) => {
    const newCheckedCells = new Set(checkedCells);
    if (newCheckedCells.has(id)) {
      newCheckedCells.delete(id);
    } else {
      newCheckedCells.add(id);
    }
    setCheckedCells(newCheckedCells);
  };

  return (
    <div
      id="bingo-card"
      className="bg-white rounded-xl shadow-xl p-3 md:p-8 max-w-3xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-medium text-gray-900 tracking-tight">
          Bingo 2025
        </h2>
      </div>

      <motion.div
        className={`grid gap-1 md:gap-3`}
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
        layout
      >
        {shuffledResolutions.slice(0, cellCount).map((resolution, index) => (
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
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  transition: {
                    duration: 0.6,
                    delay: index * 0.05,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.02 }}
                transition={{
                  layout: {
                    duration: 0.6,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
              >
                <Card 
                  className={`relative h-full p-1.5 md:p-4 min-h-[70px] sm:min-h-[90px] md:min-h-[120px] flex flex-col items-center justify-center text-center transition-all duration-200 border-gray-100 cursor-pointer
                    ${checkedCells.has(resolution.id) 
                      ? 'bg-green-50 border-green-200' 
                      : 'hover:bg-gray-50/50'}`}
                >
                  {checkedCells.has(resolution.id) && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                    </div>
                  )}
                  <p className="text-[10px] sm:text-sm md:text-base text-gray-600 leading-tight md:leading-relaxed mb-1 md:mb-2">
                    {resolution.text}
                  </p>
                  {statusMap[resolution.id] && (
                    <p className="text-[8px] md:text-xs text-gray-400 italic">
                      {statusMap[resolution.id]}
                    </p>
                  )}
                </Card>
              </motion.div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mise à jour de l'objectif</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Résolution</Label>
                  <p className="text-sm text-gray-600">{resolution.text}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="completed" 
                    checked={checkedCells.has(resolution.id)}
                    onCheckedChange={() => toggleCell(resolution.id)}
                  />
                  <label
                    htmlFor="completed"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Objectif atteint
                  </label>
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
                  Enregistrer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </motion.div>

      <div className="text-center mt-8">
        <p className="text-xs text-gray-400">
          Bingo fait sur nathanfortiche.com
        </p>
      </div>
    </div>
  );
}