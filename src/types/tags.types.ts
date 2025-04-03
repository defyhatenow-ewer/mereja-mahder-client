import { z } from "zod";
import { RelatedSchema } from "./IDoc";

export const TagSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  slugLock: z.boolean(),
  relatedPosts: RelatedSchema,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type ITag = z.infer<typeof TagSchema>;
