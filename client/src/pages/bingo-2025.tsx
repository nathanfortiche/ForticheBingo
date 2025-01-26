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
      { text: "Créer un site que des gens utilisent", status: "3 apps commencées, aucune publiée" },
      { text: "115kg Développé Couché", status: "100kg (juillet 2024)" },
      { text: "Collab avec un musée", status: "Pas commencé" }
    ],
    [
      { text: "130 séances de sport", status: "8" },
      { text: Apprendre des pas de danse", status: "Pas commencé" },
      { text: "120 films vus", status: "7" },
      { text: "10 livres lus", status: "0" }
    ],
    [
      { text: "Faire un tatouage", status: "Plein d'idées, bcp d'hésitation" },
      { text: "Faire/Planifier un voyage vers un pote expat", status: "Pas commencé" },
      { text: "Faire une vidéo YT quali (20+min)", status: "Pas commencé" },
      { text: "100kg squat", status: "80kg (janv 2025)" }
    ],
    [
      { text: "20k insta", status: "9967" },
      { text: "Passer le permis", status: "3 échecs, j'aiplus le code mdr" },
      { text: "5 nouveaux decks MTG", status: "2 en cours" },
      { text: "Diamant SoloQ sur LoL", status: "Emeraude 3" }
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