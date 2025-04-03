import { z } from "zod";
import { UserSchema } from "./users.types";
import { MetaSchema } from "./posts.types";
import { RelatedSchema } from "./IDoc";

export const SpaceSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  slugLock: z.boolean(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  users: z.object({
    docs: z.array(UserSchema),
    hasNextPage: z.boolean(),
  }),
  posts: z.object({
    docs: z.array(
      z.object({
        meta: MetaSchema,
        id: z.string(),
        title: z.string().optional(),
        slug: z.string().optional(),
      })
    ),
    hasNextPage: z.boolean(),
  }),
  pages: z.object({
    docs: z.array(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        slug: z.string().optional(),
      })
    ),
    hasNextPage: z.boolean(),
  }),
});

export const SpaceSchemaRelated = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  slugLock: z.boolean(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  users: RelatedSchema,
  posts: RelatedSchema,
  pages: RelatedSchema,
});

export type ISpace = z.infer<typeof SpaceSchema>;
