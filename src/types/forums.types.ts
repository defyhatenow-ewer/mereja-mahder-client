import { IUser } from "./users.types";

export interface IForum {
  id: string;
  author: string | IUser;
  title: string;
  description: string;
  messages?: {
    docs?: (string | IMessage)[];
    hasNextPage?: boolean;
    totalDocs?: number;
  };
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "messages".
 */
export interface IMessage {
  id: string;
  author: string | IUser;
  forum: string | IForum;
  text: string;
  replyTo?: (string | null) | IMessage;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
