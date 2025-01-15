import { useState, useEffect } from "react";
import { Resolution, GridSize } from "@/pages/home";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2, Twitter } from "lucide-react";

type Props = {
  resolutions: Resolution[];
  gridSize: GridSize;
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

  const toggleCell = (id: string) => {
    const newCheckedCells = new Set(checkedCells);
    if (newCheckedCells.has(id)) {
      newCheckedCells.delete(id);
    } else {
      newCheckedCells.add(id);
    }
    setCheckedCells(newCheckedCells);
  };

  const handleShare = (platform: 'twitter' | 'general') => {
    const completedCount = checkedCells.size;
    const totalCount = shuffledResolutions.length;
    const percentage = Math.round((completedCount / totalCount) * 100);

    const text = `J'ai accompli ${completedCount}/${totalCount} (${percentage}%) de mes résolutions pour 2024! 🎯`;
    const url = window.location.href;

    if (platform === 'twitter') {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        '_blank'
      );
    } else {
      if (navigator.share) {
        navigator.share({
          title: 'Mon Bingo des Résolutions 2024',
          text,
          url,
        }).catch(console.error);
      }
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
        {shuffledResolutions.slice(0, cellCount).map((resolution, index) => (
          <motion.div
            key={resolution.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.2,
              delay: index * 0.03,
              ease: "easeOut",
            }}
          >
            <Card 
              className={`p-4 min-h-[120px] flex items-center justify-center text-center transition-all duration-200 border-gray-100 cursor-pointer
                ${checkedCells.has(resolution.id) 
                  ? 'bg-gray-50 border-primary/50' 
                  : 'hover:bg-gray-50/50'}`}
              onClick={() => toggleCell(resolution.id)}
            >
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {resolution.text}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8 space-y-4">
        <p className="text-sm text-gray-500">
          Cochez les résolutions accomplies
        </p>

        <div className="flex justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="w-4 h-4" />
            Partager sur Twitter
          </Button>
          {navigator.share && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => handleShare('general')}
            >
              <Share2 className="w-4 h-4" />
              Partager
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}