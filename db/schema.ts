import { z } from "zod";

export const personalResolutionSchema = z.object({
  id: z.string(),
  text: z.string(),
  status: z.string().default("Pas commencé"),
  position: z.number(),
  updatedAt: z.string(),
});

export type PersonalResolution = z.infer<typeof personalResolutionSchema>;