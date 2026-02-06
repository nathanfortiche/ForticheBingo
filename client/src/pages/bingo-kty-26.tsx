import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const BINGO_DATA = {
  title: "Bingo ForticheKty 2026",
  subtitle: "Bonne Chance ForticheKty !",
  grid: [
    [
      { text: "Voir 200 films", status: "29/200", completed: false },
      {
        text: "Repeindre murs de la cuisine",
        status: "Pas commencé",
        completed: false,
      },
      { text: "1 cours Kiplin/semaine", status: "2/52", completed: false },
      { text: "Tricoter 1 sock box", status: "1/12", completed: false },
    ],
    [
      {
        text: "Fixer date retraite et commencer dossier",
        status: "Pas commencé",
        completed: false,
      },
      { text: "Lire 99 livres", status: "7/99", completed: false },
      { text: "Un séjour avec Hapimag", status: "0/1", completed: false },
      {
        text: "Aller à 4 concerts/spectacles",
        status: "2/4",
        completed: false,
      },
    ],
    [
      { text: "24 séances de piscine", status: "0/24", completed: false },
      { text: "Défi des 52 enveloppes", status: "37/1378", completed: false },
      {
        text: "Tricoter un pull pour mon anniversaire",
        status: "Pas commencé",
        completed: false,
      },
      {
        text: "Prendre rdv chez un dentiste",
        status: "Fait (Premier RDV en 10 ans !)",
        completed: true,
      },
    ],
    [
      {
        text: "Terminer 3 challenges lectures",
        status: "0/3",
        completed: false,
      },
      { text: "2300 km en vélo", status: "22/2300", completed: false },
      {
        text: "Faire reconstruction du sein",
        status: "RDV pris !",
        completed: false,
      },
      {
        text: "1 long week-end « ailleurs » par trimestre",
        status: "0/4",
        completed: false,
      },
    ],
  ],
};

export default function BingoKty26() {
  useEffect(() => {
    document.title = "Bingo ForticheKty 2026";
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

        <div
          id="bingo-card"
          className="bg-white rounded-xl shadow-xl p-3 md:p-8 max-w-3xl mx-auto mb-8 md:mb-12"
        >
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
                    ${
                      item.completed
                        ? "bg-green-50 border-green-200"
                        : "hover:bg-gray-50/50"
                    }`}
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
      </div>
    </div>
  );
}
