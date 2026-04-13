import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes = ['', '/projects', '/services', '/about', '/blog'].map((route) => ({
    url: `https://mesharktech.co.ke${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const blogPosts = getBlogPosts().map((post) => ({
    url: `https://mesharktech.co.ke/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...coreRoutes, ...blogPosts];
}
