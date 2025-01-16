import { useState, useEffect, useRef } from "react";
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
import { Share2, Instagram, Twitter } from "lucide-react";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

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

  const handleShare = async (platform?: 'instagram' | 'twitter') => {
    try {
      if (!cardRef.current) return;

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });

      const imageUrl = canvas.toDataURL('image/png');
      const shareData = {
        title: 'Mon Bingo 2025',
        text: 'Découvrez mon Bingo des objectifs 2025 ! Créez le vôtre sur:',
        url: window.location.origin,
      };

      // If Web Share API is available and no specific platform is selected
      if (navigator.share && !platform) {
        try {
          const blob = await (await fetch(imageUrl)).blob();
          const file = new File([blob], 'bingo-2025.png', { type: 'image/png' });
          await navigator.share({
            ...shareData,
            files: [file],
          });
          return;
        } catch (error) {
          console.error('Error sharing:', error);
        }
      }

      if (platform === 'instagram') {
        // For Instagram, we'll download the image and show instructions
        const link = document.createElement("a");
        link.download = "bingo-2025.png";
        link.href = imageUrl;
        link.click();

        toast({
          title: "Image téléchargée !",
          description: "Ouvrez Instagram et partagez l'image dans votre story",
        });
        return;
      }

      // Twitter sharing
      if (platform === 'twitter') {
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`;
        window.open(shareUrl, '_blank', 'width=600,height=400');
      }

      toast({
        title: "Partage réussi !",
        description: "Votre bingo a été partagé",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de partager le bingo. Réessayez.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div
        ref={cardRef}
        id="bingo-card"
        className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-medium text-gray-900 tracking-tight mb-2">
            Bingo 2025
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
                    <Label>Objectif</Label>
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
      </div>

      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => handleShare('instagram')}
        >
          <Instagram className="h-4 w-4" />
          Instagram
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => handleShare('twitter')}
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => handleShare()}
        >
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          Cliquez sur un objectif pour ajouter un statut
        </p>
      </div>
    </div>
  );
}