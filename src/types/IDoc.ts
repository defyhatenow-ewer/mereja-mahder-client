import { z } from "zod";

export const DocSchema = z.object({
  id: z.string(),
});

export type IDoc = z.infer<typeof DocSchema>;

export const RelatedSchema = z.object({
  docs: z.array(z.string()),
  hasNextPage: z.boolean(),
});

export type IRelated = z.infer<typeof RelatedSchema>;
