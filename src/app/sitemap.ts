import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/projects', '/services', '/about'].map((route) => ({
    url: `https://mesharktech.co.ke${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}
