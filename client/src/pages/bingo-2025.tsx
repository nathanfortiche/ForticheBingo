import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check } from "lucide-react";

const BINGO_DATA = {
  title: "Mon Bingo 2025",
  subtitle: "Suivez l'évolution de mes objectifs pour 2025 !",
  grid: [
    [
      { text: "100k tiktok", status: "64.1k", completed: false },
      { text: "Créer un site que des gens utilisent", status: "100+  personnes ont utilisé celui-ci !", completed: true },
      { text: "110kg Développé Couché", status: "100kg (juillet 2024)", completed: false },
      { text: "Collab avec un musée", status: "Quelques idées", completed: false }
    ],
    [
      { text: "130 séances de sport", status: "74", completed: false },
      { text: "Apprendre des pas de danse", status: "Pas commencé", completed: false },
      { text: "120 films vus", status: "89", completed: false },
      { text: "10 livres finis", status: "4/10", completed: false }
    ],
    [
      { text: "Faire un tatouage", status: "Plein d'idées, bcp d'hésitation", completed: false },
      { text: "Compléter mon Pokédex de cartes", status: "981/1025", completed: false },
      { text: "Faire une vidéo YT quali (20+min)", status: "J'ai le sujet", completed: false },
      { text: "100kg squat", status: "100kg x3 reps (Avril 2025)", completed: true }
    ],
    [
      { text: "20k insta", status: "17,6k", completed: false },
      { text: "Passer le permis", status: "3 échecs, j'ai plus le code mdr", completed: false },
      { text: "5 nouveaux decks MTG", status: "5/5", completed: true },
      { text: "Diamant SoloQ sur LoL", status: "Emeraude 3", completed: false }
    ]
  ]
};

export default function Bingo2025() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 tracking-tight">
            {BINGO_DATA.title}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
            {BINGO_DATA.subtitle}
          </p>
        </div>

        <div id="bingo-card" className="bg-white rounded-xl shadow-xl p-3 md:p-8 max-w-3xl mx-auto mb-8 md:mb-12">
          <div className="grid grid-cols-4 gap-1 md:gap-3 auto-rows-fr">
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
                  className={`relative h-full p-1.5 md:p-4 min-h-[70px] sm:min-h-[90px] md:min-h-[120px] flex flex-col items-center justify-center text-center transition-all duration-200 border-gray-100
                    ${item.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'hover:bg-gray-50/50'}`}
                >
                  {item.completed && (
                    <div className="absolute top-1 right-1 md:top-2 md:right-2">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                    </div>
                  )}
                  <p className="text-[10px] sm:text-sm md:text-base text-gray-600 leading-tight md:leading-relaxed mb-1 md:mb-2">
                    {item.text}
                  </p>
                  <p className="text-[8px] md:text-xs text-gray-400 italic">
                    {item.status}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
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