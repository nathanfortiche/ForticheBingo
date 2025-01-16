import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type Resolution = {
  id: number;
  text: string;
  status: string;
  position: number;
};

export default function Admin() {
  const { toast } = useToast();
  const [editingStatus, setEditingStatus] = useState<{[key: number]: string}>({});

  const { data: resolutions, refetch } = useQuery<Resolution[]>({
    queryKey: ["/api/personal-resolutions"],
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/personal-resolutions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (!res.ok) {
        throw new Error("Failed to update status");
      }
    },
    onSuccess: () => {
      refetch();
      toast({
        title: "Succès",
        description: "Le statut a été mis à jour",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (resolution: Resolution) => {
    const newStatus = editingStatus[resolution.id];
    if (newStatus === undefined || newStatus === resolution.status) return;

    updateStatus.mutate({
      id: resolution.id,
      status: newStatus,
    });
    setEditingStatus(prev => ({ ...prev, [resolution.id]: "" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-16">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Admin - Gestion des résolutions
        </h1>

        <div className="space-y-4">
          {resolutions?.map((resolution) => (
            <Card key={resolution.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {resolution.text}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Statut actuel: {resolution.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      className="w-64"
                      placeholder="Nouveau statut"
                      value={editingStatus[resolution.id] || ""}
                      onChange={(e) => setEditingStatus(prev => ({
                        ...prev,
                        [resolution.id]: e.target.value
                      }))}
                    />
                    <Button 
                      variant="outline"
                      onClick={() => handleStatusUpdate(resolution)}
                      disabled={!editingStatus[resolution.id] || editingStatus[resolution.id] === resolution.status}
                    >
                      Mettre à jour
                    </Button>
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
