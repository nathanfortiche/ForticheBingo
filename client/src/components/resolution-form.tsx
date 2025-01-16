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
      text: z.string().max(50, "50 caractères maximum"),
    })
  ).min(9, "Minimum 9 objectifs requis"),
  gridSize: z.enum(["3x3", "3x4", "4x4"]),
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
  const getMinResolutions = (size: string) => {
    switch (size) {
      case "3x3": return 9;
      case "3x4": return 12;
      case "4x4": return 16;
      default: return 9;
    }
  };
  const minResolutions = getMinResolutions(gridSize);

  const handleFormSubmit = (data: FormData) => {
    // Replace empty resolutions with "Case gratuite"
    const filledResolutions = {
      ...data,
      resolutions: data.resolutions.map(resolution => ({
        ...resolution,
        text: resolution.text.trim() === "" ? "Case gratuite" : resolution.text
      }))
    };
    onSubmit(filledResolutions);
  };

  // Update form when grid size changes
  const handleGridSizeChange = (newSize: GridSize) => {
    const requiredCount = getMinResolutions(newSize);
    const currentResolutions = form.getValues("resolutions");

    const newResolutions = Array(requiredCount)
      .fill(0)
      .map((_, index) => {
        return currentResolutions[index] || { id: nanoid(), text: "" };
      });

    form.setValue("gridSize", newSize);
    form.setValue("resolutions", newResolutions);
  };

  return (
    <Card className="max-w-2xl mx-auto border-0 shadow-lg">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="gridSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Format de la grille</FormLabel>
                  <Select
                    onValueChange={(value) => handleGridSizeChange(value as GridSize)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Choisir un format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3x3">3 × 3 (9 objectifs)</SelectItem>
                      <SelectItem value="3x4">3 × 4 (12 objectifs)</SelectItem>
                      <SelectItem value="4x4">4 × 4 (16 objectifs)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-gray-700">Vos objectifs</FormLabel>
              {form.getValues("resolutions").map((_, index) => (
                <FormField
                  key={form.getValues(`resolutions.${index}.id`)}
                  control={form.control}
                  name={`resolutions.${index}.text`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={`Objectif ${index + 1}`}
                          {...field}
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800"
            >
              Créer mon bingo
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}