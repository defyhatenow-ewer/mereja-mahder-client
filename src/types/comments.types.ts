import { z } from "zod";
import { UserSchema } from "./users.types";
import { PostSchema } from "./posts.types";
import { DocSchema } from "./IDoc";

export const CommentSchema = z.object({
  id: z.string(),
  author: UserSchema,
  email: z.string().email(),
  content: z.string(),
  replyPost: PostSchema,
  isApproved: z.boolean(),
  replyComment: DocSchema.optional(),
});

export type IComment = z.infer<typeof CommentSchema>;
