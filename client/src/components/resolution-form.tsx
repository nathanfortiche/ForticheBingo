import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nanoid } from "nanoid";
import { Resolution, GridSize } from "@/pages/home";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  resolutions: z.array(
    z.object({
      id: z.string(),
      text: z.string().min(1, "La résolution ne peut pas être vide").max(50, "La résolution est trop longue"),
    })
  ).min(9, "Ajoutez au moins 9 résolutions"),
  gridSize: z.enum(["3x3", "4x4"]),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  onSubmit: (data: FormData) => void;
};

export default function ResolutionForm({ onSubmit }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resolutions: Array(9).fill(0).map(() => ({ id: nanoid(), text: "" })),
      gridSize: "3x3",
    },
  });

  const gridSize = form.watch("gridSize");
  const minResolutions = gridSize === "3x3" ? 9 : 16;

  const addResolution = () => {
    const currentResolutions = form.getValues("resolutions");
    form.setValue("resolutions", [
      ...currentResolutions,
      { id: nanoid(), text: "" },
    ]);
  };

  const removeResolution = (index: number) => {
    const currentResolutions = form.getValues("resolutions");
    form.setValue(
      "resolutions",
      currentResolutions.filter((_, i) => i !== index)
    );
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white/90 backdrop-blur">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="gridSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taille de la Grille</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez la taille" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3x3">3x3</SelectItem>
                      <SelectItem value="4x4">4x4</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Vos Résolutions</FormLabel>
              {form.getValues("resolutions").map((_, index) => (
                <FormField
                  key={form.getValues(`resolutions.${index}.id`)}
                  control={form.control}
                  name={`resolutions.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder={`Résolution ${index + 1}`}
                            {...field}
                            className="font-serif"
                          />
                          {form.getValues("resolutions").length > minResolutions && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeResolution(index)}
                              className="text-gray-500"
                            >
                              ×
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={addResolution}
              className="w-full"
            >
              Ajouter une Résolution
            </Button>

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
            >
              Générer la Carte de Bingo
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}