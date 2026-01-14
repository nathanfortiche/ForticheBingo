import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const BINGO_DATA = {
  title: "Bingo Zeloui 2026",
  subtitle: "Bonne chance Zeloui !",
  grid: [
    [
      { text: "Commencer une nouvelle langue", status: "Pas commencé", completed: false },
      { text: "Faire 52 séances de sport", status: "2/52", completed: false },
      { text: "Participer à 2 concours d'écriture", status: "0/2", completed: false },
      { text: "Voyager avec ma mère", status: "Pas commencé", completed: false }
    ],
    [
      { text: "Lire 35 livres", status: "1/35", completed: false },
      { text: "Passer le code de la route", status: "Pas commencé", completed: false },
      { text: "Voir 130 films", status: "8/130", completed: false },
      { text: "Organiser un week-end retraite d'écriture", status: "Pas commencé", completed: false }
    ],
    [
      { text: "Commencer la photo argentique", status: "Pas commencé", completed: false },
      { text: "Changer de boulot", status: "Pas commencé", completed: false },
      { text: "Mener des interviews sur la mémoire familiale", status: "Pas commencé", completed: false },
      { text: "Découvrir 24 nouveaux restos", status: "3/24", completed: false }
    ],
    [
      { text: "Faire 1 gros voyage", status: "Pas commencé", completed: false },
      { text: "Participer à des ateliers d'écriture", status: "Pas commencé", completed: false },
      { text: "Constituer un album photo", status: "Pas commencé", completed: false },
      { text: "Faire un plongeon dans le documentaire", status: "2 docus vus", completed: false }
    ]
  ]
};

export default function BingoZeloui26() {
  useEffect(() => {
    document.title = "Bingo Zeloui 2026";
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
                  <p className="text-[9px] sm:text-xs md:text-sm text-gray-600 leading-tight md:leading-relaxed mb-1 md:mb-2">
                    {item.text}
                  </p>
                  <p className="text-[7px] md:text-xs text-gray-400 italic">
                    {item.status}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
