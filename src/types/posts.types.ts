import { z } from "zod";
import { RelatedSchema } from "./IDoc";
import { CategorySchema } from "./categories.types";
import { TagSchema } from "./tags.types";
import { UserSchema } from "./users.types";
import { SpaceSchemaRelated } from "./space.types";
import { IMedia } from "./media.types";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export const PopulatedAuthors = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
  })
);

export const MetaSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  iframe: z.string().optional(),
  excerpt: z.string().optional(),
  pdf: z.string().optional(),
  relatedPosts: RelatedSchema,
  categories: z.array(CategorySchema),
  tags: z.array(TagSchema),
  authors: z.array(UserSchema),
  views: z.number(),
  space: SpaceSchemaRelated,
  slugLock: z.boolean(),
  _status: z.enum(["draft", "published"]),
  populatedAuthors: PopulatedAuthors,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  meta: MetaSchema,
});

export type IPost = z.infer<typeof PostSchema> & {
  featuredImage: IMedia | string;
  content: SerializedEditorState;
  excerpt: SerializedEditorState;
};
