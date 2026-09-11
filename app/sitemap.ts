import type { MetadataRoute } from 'next';
import { townPages } from '@/content/town-pages';
import { business } from '@/lib/business';
import { services } from '@/lib/services';
import { getAllArticles } from '@/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '', priority: 1 },
    { path: '/get-a-quote', priority: 0.9 },
    { path: '/what-we-do', priority: 0.8 },
    { path: '/areas-we-cover', priority: 0.7 },
    { path: '/help-and-advice', priority: 0.6 },
    { path: '/collection/boiler-kw-calculator', priority: 0.7 },
    { path: '/meet-the-team', priority: 0.5 },
    { path: '/leave-a-review', priority: 0.5 },
    { path: '/contact-us', priority: 0.8 },
    { path: '/privacy-policy', priority: 0.1 },
  ].map(({ path, priority }) => ({
    url: `${business.url}${path}`,
    changeFrequency: 'monthly' as const,
    priority,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${business.url}/what-we-do/${s.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const landingRoutes: MetadataRoute.Sitemap = townPages.map((t) => ({
    url: `${business.url}/areas/${t.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const articles = await getAllArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${business.url}/help-and-advice/${a.slug}`,
    lastModified: a._updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...landingRoutes, ...articleRoutes];
}
