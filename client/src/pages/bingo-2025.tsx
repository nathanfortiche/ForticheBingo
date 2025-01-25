import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

const BINGO_DATA = {
  title: "Mon Bingo 2025",
  subtitle: "Suivez l'évolution de mes résolutions pour 2025",
  grid: [
    [
      { text: "100k tiktok", status: "60,9k" },
      { text: "App utilisée", status: "3 apps commencées, aucune publiée" },
      { text: "120kg DC", status: "100kg (juillet 2024)" },
      { text: "Collab musée", status: "Pas commencé" }
    ],
    [
      { text: "130 séances", status: "5" },
      { text: "Danse", status: "Pas commencé" },
      { text: "120 films", status: "3" },
      { text: "10 livres", status: "0" }
    ],
    [
      { text: "Tatouage", status: "Plein d'idées, bcp d'hésitation" },
      { text: "Voyage pote", status: "Pas commencé" },
      { text: "Vidéo 20min", status: "Pas commencé" },
      { text: "100kg squat", status: "80kg (janv 2025)" }
    ],
    [
      { text: "20k insta", status: "8816" },
      { text: "Permis", status: "3 échecs, plus le code" },
      { text: "5 decks MTG", status: "1 en cours" },
      { text: "Diamant LoL", status: "Plat 1" }
    ]
  ]
};

export default function Bingo2025() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">
            {BINGO_DATA.title}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            {BINGO_DATA.subtitle}
          </p>
        </div>

        <div id="bingo-card" className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto mb-12">
          <div className="grid grid-cols-4 gap-3">
            {BINGO_DATA.grid.flat().map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                <Card 
                  className="p-4 min-h-[120px] flex flex-col items-center justify-center text-center transition-all duration-200 border-gray-100 hover:bg-gray-50/50"
                >
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-2">
                    {item.text}
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    {item.status}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Envie de créer votre propre bingo des résolutions ?
          </p>
          <Link href="/">
            <Button className="bg-gray-900 hover:bg-gray-800">
              Créer mon bingo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}