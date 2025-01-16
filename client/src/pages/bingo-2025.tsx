import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";

type Resolution = {
  id: number;
  text: string;
  status: string;
  position: number;
};

export default function Bingo2025() {
  const { data: resolutions } = useQuery<Resolution[]>({
    queryKey: ["/api/personal-resolutions"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight">
            Mon Bingo 2025
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Suivez l'évolution de mes résolutions pour 2025
          </p>
        </div>

        <div id="bingo-card" className="bg-white rounded-xl shadow-xl p-8 max-w-3xl mx-auto mb-12">
          <div className="grid grid-cols-4 gap-3">
            {resolutions?.map((resolution) => (
              <motion.div
                key={resolution.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  ease: "easeOut",
                }}
              >
                <Card 
                  className="p-4 min-h-[120px] flex flex-col items-center justify-center text-center transition-all duration-200 border-gray-100 hover:bg-gray-50/50"
                >
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-2">
                    {resolution.text}
                  </p>
                  <p className="text-xs text-gray-400 italic">
                    {resolution.status}
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
