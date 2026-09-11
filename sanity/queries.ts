import { groq } from 'next-sanity';
import { sanityClient } from './client';

export type ArticleSummary = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  _updatedAt: string;
  excerpt?: string;
  coverImage?: { asset?: { _ref: string }; alt?: string };
};

export type Article = ArticleSummary & {
  body: unknown;
};

const listQuery = groq`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    excerpt,
    coverImage
  }
`;

const bySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    excerpt,
    coverImage,
    body
  }
`;

const slugsQuery = groq`
  *[_type == "article" && defined(slug.current)][].slug.current
`;

export async function getAllArticles(): Promise<ArticleSummary[]> {
  if (!sanityClient) {
    return [];
  }
  return sanityClient.fetch<ArticleSummary[]>(
    listQuery,
    {},
    { next: { revalidate: 300, tags: ['articles'] } }
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!sanityClient) {
    return null;
  }
  return sanityClient.fetch<Article | null>(
    bySlugQuery,
    { slug },
    { next: { revalidate: 300, tags: ['articles'] } }
  );
}

export async function getAllArticleSlugs(): Promise<string[]> {
  if (!sanityClient) {
    return [];
  }
  return sanityClient.fetch<string[]>(slugsQuery, {}, { next: { revalidate: 3600 } });
}
