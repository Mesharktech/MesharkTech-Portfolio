import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface BlogPost extends BlogPostMetadata {
  content: string;
}

const contentDir = path.join(process.cwd(), 'content', 'blog');

export function getBlogPosts(): BlogPostMetadata[] {
  if (!fs.existsSync(contentDir)) return [];
  
  const files = fs.readdirSync(contentDir);
  const posts = files
    .filter(filename => filename.endsWith('.md') || filename.endsWith('.mdx'))
    .map(filename => {
      const slug = filename.replace(/\.mdx?$/, '');
      const fullPath = path.join(contentDir, filename);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      
      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || '',
        description: data.description || '',
        tags: data.tags || [],
      } as BlogPostMetadata;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
  const fullPath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || '',
    description: data.description || '',
    tags: data.tags || [],
    content,
  };
}
