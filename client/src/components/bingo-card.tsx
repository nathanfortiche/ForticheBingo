import { useEffect, useState } from "react";
import { Resolution, GridSize } from "@/pages/home";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

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
  
  useEffect(() => {
    setShuffledResolutions(shuffleArray(resolutions));
  }, [resolutions]);

  const gridSizeNum = gridSize === "3x3" ? 3 : 4;
  const cellCount = gridSizeNum * gridSizeNum;

  return (
    <div
      id="bingo-card"
      className="bg-white rounded-xl shadow-lg p-6 max-w-3xl mx-auto"
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-amber-500 mb-2">
          2024 Resolution Bingo
        </h2>
        <div className="h-1 w-32 bg-gradient-to-r from-yellow-500 to-amber-500 mx-auto" />
      </div>

      <div
        className={`grid gap-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSizeNum}, 1fr)`,
        }}
      >
        {shuffledResolutions.slice(0, cellCount).map((resolution, index) => (
          <motion.div
            key={resolution.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut",
            }}
          >
            <Card className="p-4 min-h-[120px] flex items-center justify-center text-center hover:shadow-md transition-shadow border-2 border-amber-200">
              <p className="font-['Segoe_Print',_cursive] text-sm md:text-base">
                {resolution.text}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        Check off each resolution as you achieve it throughout the year!
      </div>
    </div>
  );
}
