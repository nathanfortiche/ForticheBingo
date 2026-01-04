import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Check } from "lucide-react";

const BINGO_DATA = {
  title: "Mon Bingo 2026",
  subtitle: "Suivez l'évolution de mes objectifs pour 2026 !",
  grid: [
    [
      { text: "Faire 20 tractions d'affilée", status: "Record : 12", completed: false },
      { text: "Passer le permis", status: "Pas commencé", completed: false },
      { text: "100k TikTok", status: "65k", completed: false },
      { text: "Collectionner tous les arts de Rondoudou", status: "5/33", completed: false }
    ],
    [
      { text: "Tester le Kite Surf", status: "Pas commencé, encore en rééducation", completed: false },
      { text: "Voir 130 films", status: "3/130", completed: false },
      { text: "Me faire tatouer", status: "J'ai une idée précise", completed: false },
      { text: "30k Insta", status: "21.5k", completed: false }
    ],
    [
      { text: "Faire un muscle up", status: "Impossible pour l'instant", completed: false },
      { text: "Créer 6 sites cools ", status: "2 En cours de développement !", completed: false },
      { text: "Apprendre des pas de danse", status: "Pas commencé", completed: false },
      { text: "Lancer 1 nouveau compte TikTok", status: "Plusieurs idées", completed: false }
    ],
    [
      { text: "Passer Diamant SoloQ sur LoL", status: "E3 fin de saison, E1 peak", completed: false },
      { text: "Finir 12 livres", status: "0/12", completed: false },
      { text: "Collab avec un musée/média", status: "Pas commencé", completed: false },
      { text: "Faire 111 séances de sport", status: "2/111", completed: false }
    ]
  ]
};

export default function Bingo2026() {
  useEffect(() => {
    document.title = "Mon Bingo 2026";
  }, []);

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

        <div className="text-center space-y-4">
          <p className="text-sm md:text-base text-gray-600">
            Envie de créer votre propre bingo des résolutions ?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="bg-gray-900 hover:bg-gray-800">
                Créer mon bingo
              </Button>
            </Link>
            <Link href="/bingo-2025">
              <Button variant="outline">
                Voir le Bingo 2025
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
