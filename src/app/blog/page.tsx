import { getBlogPosts } from "@/lib/blog";
import Link from "next/link";
import { format } from "date-fns";

export const metadata = {
  title: "Insights & Engineering Blog | Mesharktech",
  description: "Technical deep-dives into software architecture, cybersecurity, and full-stack Next.js deployment."
};

export default function BlogIndex() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen bg-meshark-slateDark pt-32 pb-24 px-6 md:px-12 wrapper">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
          Engineering <span className="flame-font-cyan glow-cyan">Insights</span>
        </h1>
        <p className="text-meshark-silver text-lg mb-16 max-w-2xl font-mono border-l-2 border-meshark-cyanLight pl-4">
          Tactical playbooks, security audits, and deep-dives on shipping scalable software.
        </p>

        <div className="grid gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-meshark-cyan/40 hover:bg-white/[0.04] transition-all glow-cyan-hover">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 text-[11px] font-mono uppercase bg-meshark-cyan/10 text-meshark-cyanLight rounded-full border border-meshark-cyan/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <time className="text-sm font-mono text-meshark-silverLight/50">
                    {post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : 'Recently'}
                  </time>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-meshark-cyan transition-colors">
                  {post.title}
                </h2>
                <p className="text-meshark-silver leading-relaxed">
                  {post.description}
                </p>
                <div className="mt-6 flex items-center font-mono text-sm text-meshark-cyan font-bold">
                  Read Protocol <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
