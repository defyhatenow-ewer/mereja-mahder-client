import { z } from 'zod';
import { RelatedSchema } from './IDoc';
import { CategorySchema, ICategory } from './categories.types';
import { ITag, TagSchema } from './tags.types';
import { IUser, UserSchema } from './users.types';
import { ISpace, SpaceSchemaRelated } from './space.types';
import { IMedia } from './media.types';
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

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
  _status: z.enum(['draft', 'published']),
  populatedAuthors: PopulatedAuthors,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().optional(),
  meta: MetaSchema,
});

export interface IPost {
  id: string;
  title: string;
  featuredImage?: (string | null) | IMedia;
  content: SerializedEditorState;
  excerpt?: SerializedEditorState;
  pdf?: (string | null) | IMedia;
  iframe?: string | null;
  relatedPosts?: (string | IPost)[] | null;
  categories?: (string | ICategory)[] | null;
  tags?: ITag[];
  meta?: {
    title?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | IMedia;
    description?: string | null;
  };
  publishedAt?: string;
  authors?: (string | IUser)[] | null;
  populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
      }[]
    | null;
  views?: number | null;
  space?: (string | null) | ISpace;
  privacy?: ('private' | 'public') | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}

export interface IReport {
  id: string;
  title: string;
  featuredImage?: (string | null) | IMedia;
  content: SerializedEditorState;
  excerpt?: SerializedEditorState;
  pdf?: (string | null) | IMedia;
  relatedReports?: (string | IReport)[] | null;
  categories?: (string | ICategory)[] | null;
  tags?: ITag[];
  meta?: {
    title?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | IMedia;
    description?: string | null;
  };
  publishedAt?: string;
  authors?: (string | IUser)[] | null;
  populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
      }[]
    | null;
  views?: number | null;
  space?: (string | null) | ISpace;
  privacy?: ('private' | 'public') | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "articles".
 */
export interface IArticle {
  id: string;
  title: string;
  featuredImage?: (string | null) | IMedia;
  content: SerializedEditorState;
  excerpt?: SerializedEditorState;
  relatedArticles?: (string | IArticle)[] | null;
  categories?: (string | ICategory)[] | null;
  tags?: ITag[];
  meta?: {
    title?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | IMedia;
    description?: string | null;
  };
  publishedAt?: string;
  authors?: (string | IUser)[] | null;
  populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
      }[]
    | null;
  views?: number | null;
  space?: (string | null) | ISpace;
  privacy?: ('private' | 'public') | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "materials".
 */
export interface IMaterial {
  id: string;
  title: string;
  featuredImage?: (string | null) | IMedia;
  content: SerializedEditorState;
  excerpt?: SerializedEditorState;
  pdf?: (string | null) | IMedia;
  relatedMaterials?: (string | IMaterial)[] | null;
  categories?: (string | ICategory)[] | null;
  tags?: ITag[];
  meta?: {
    title?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | IMedia;
    description?: string | null;
  };
  publishedAt?: string;
  authors?: (string | IUser)[] | null;
  populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
      }[]
    | null;
  views?: number | null;
  space?: (string | null) | ISpace;
  privacy?: ('private' | 'public') | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
export interface IResource {
  id: string;
  title: string;
  featuredImage?: (string | null) | IMedia;
  content: SerializedEditorState;
  excerpt?: SerializedEditorState;
  pdf?: (string | null) | IMedia;
  relatedResources?: (string | IResource)[] | null;
  categories?: (string | ICategory)[] | null;
  tags?: ITag[];
  meta?: {
    title?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | IMedia;
    description?: string | null;
  };
  publishedAt?: string;
  authors?: (string | IUser)[] | null;
  populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
      }[]
    | null;
  views?: number | null;
  space?: (string | null) | ISpace;
  privacy?: ('private' | 'public') | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "resources".
 */
export interface ISafetyResource {
  id: string;
  title: string;
  featuredImage?: (string | null) | IMedia;
  content: SerializedEditorState;
  excerpt?: SerializedEditorState;
  pdf?: (string | null) | IMedia;
  relatedSafetyResources?: (string | ISafetyResource)[] | null;
  categories?: (string | ICategory)[] | null;
  tags?: ITag[];
  meta?: {
    title?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | IMedia;
    description?: string | null;
  };
  publishedAt?: string;
  authors?: (string | IUser)[] | null;
  populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
      }[]
    | null;
  views?: number | null;
  space?: (string | null) | ISpace;
  privacy?: ('private' | 'public') | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}

export interface ILearningResource {
  id: string;
  title: string;
  featuredImage?: (string | null) | IMedia;
  content: SerializedEditorState;
  excerpt?: SerializedEditorState;
  pdf?: (string | null) | IMedia;
  relatedLearningResources?: (string | ILearningResource)[] | null;
  categories?: (string | ICategory)[] | null;
  tags?: ITag[];
  meta?: {
    title?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | IMedia;
    description?: string | null;
  };
  publishedAt?: string;
  authors?: (string | IUser)[] | null;
  populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
      }[]
    | null;
  views?: number | null;
  space?: (string | null) | ISpace;
  privacy?: ('private' | 'public') | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "shows".
 */
export interface IShow {
  id: string;
  title: string;
  featuredImage?: (string | null) | IMedia;
  content: SerializedEditorState;
  excerpt?: SerializedEditorState;
  iframe: string;
  relatedShows?: (string | IShow)[] | null;
  categories?: (string | ICategory)[] | null;
  tags?: ITag[];
  meta?: {
    title?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | IMedia;
    description?: string | null;
  };
  publishedAt?: string;
  authors?: (string | IUser)[] | null;
  populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
      }[]
    | null;
  views?: number | null;
  space?: (string | null) | ISpace;
  privacy?: ('private' | 'public') | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "charts".
 */
export interface IChart {
  id: string;
  title: string;
  featuredImage?: (string | null) | IMedia;
  content: SerializedEditorState;
  excerpt?: SerializedEditorState;
  iframe: string;
  relatedCharts?: (string | IChart)[] | null;
  categories?: (string | ICategory)[] | null;
  tags?: ITag[];
  meta?: {
    title?: string | null;
    /**
     * Maximum upload file size: 12MB. Recommended file size for images is <500KB.
     */
    image?: (string | null) | IMedia;
    description?: string | null;
  };
  publishedAt?: string;
  authors?: (string | IUser)[] | null;
  populatedAuthors?:
    | {
        id?: string | null;
        name?: string | null;
      }[]
    | null;
  views?: number | null;
  space?: (string | null) | ISpace;
  privacy?: ('private' | 'public') | null;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}

export interface ISuggestion {
  id: string;
  title: string;
  content: string;
  attachment?: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "banners".
 */
export interface IBanner {
  id: string;
  title: string;
  image: string | IMedia;
  links: LinkBlock[];
  space: string | ISpace;
  slug?: string | null;
  slugLock?: boolean | null;
  updatedAt: string;
  createdAt: string;
}

export interface LinkBlock {
  links?:
    | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'posts';
            value: string | IPost;
          } | null;
          url?: string | null;
          label: string;
          /**
           * Choose how the link should be rendered.
           */
          appearance?: ('default' | 'outline') | null;
        };
        id?: string | null;
      }[]
    | null;
  id?: string | null;
  blockName?: string | null;
  blockType: 'link';
}
