import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

type Resolution = {
  id: number;
  text: string;
  status: string;
  position: number;
};

type EditingState = {
  [key: number]: {
    text?: string;
    status?: string;
  };
};

export default function Admin() {
  const { toast } = useToast();
  const [editingState, setEditingState] = useState<EditingState>({});
  const [_, setLocation] = useLocation();

  const { data: resolutions, refetch } = useQuery<Resolution[]>({
    queryKey: ["/api/admin4768932/resolutions"],
  });

  const updateResolution = useMutation({
    mutationFn: async ({ id, text, status }: { id: number; text?: string; status?: string }) => {
      const res = await fetch(`/api/admin4768932/resolutions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update");
      }
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Succès",
        description: "La modification a été enregistrée",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer la modification",
        variant: "destructive",
      });
    },
  });

  const handleUpdate = (resolution: Resolution, type: 'text' | 'status') => {
    const newValue = editingState[resolution.id]?.[type];
    if (newValue === undefined || newValue === resolution[type]) return;

    updateResolution.mutate({
      id: resolution.id,
      [type]: newValue,
    });
    setEditingState(prev => ({
      ...prev,
      [resolution.id]: {
        ...prev[resolution.id],
        [type]: "",
      }
    }));
  };

  if (!resolutions) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin - Gestion des objectifs
        </h1>

        <Button 
          variant="outline" 
          onClick={async () => {
            await fetch('/api/logout', { 
              method: 'POST',
              credentials: 'include'
            });
            setLocation("/auth");
          }}
        >
          Se déconnecter
        </Button>

        <div className="space-y-4">
          {resolutions.map((resolution) => (
            <Card key={resolution.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        Objectif actuel: {resolution.text}
                      </h3>
                      <Input
                        className="mt-2"
                        placeholder="Modifier l'objectif"
                        value={editingState[resolution.id]?.text || ""}
                        onChange={(e) => setEditingState(prev => ({
                          ...prev,
                          [resolution.id]: {
                            ...prev[resolution.id],
                            text: e.target.value
                          }
                        }))}
                      />
                      <Button 
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleUpdate(resolution, 'text')}
                        disabled={!editingState[resolution.id]?.text || editingState[resolution.id]?.text === resolution.text}
                      >
                        Modifier l'objectif
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-4 border-t">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        Statut actuel: {resolution.status}
                      </p>
                      <Input
                        className="mt-2"
                        placeholder="Nouveau statut"
                        value={editingState[resolution.id]?.status || ""}
                        onChange={(e) => setEditingState(prev => ({
                          ...prev,
                          [resolution.id]: {
                            ...prev[resolution.id],
                            status: e.target.value
                          }
                        }))}
                      />
                      <Button 
                        variant="outline"
                        className="mt-2"
                        onClick={() => handleUpdate(resolution, 'status')}
                        disabled={!editingState[resolution.id]?.status || editingState[resolution.id]?.status === resolution.status}
                      >
                        Modifier le statut
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}