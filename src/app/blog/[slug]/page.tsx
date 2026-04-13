import { getBlogPost, getBlogPosts } from "@/lib/blog";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getBlogPost(resolvedParams.slug);
  if (!post) return {};
  
  return {
    title: `${post.title} | Mesharktech Insights`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getBlogPost(resolvedParams.slug);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-meshark-slateDark pt-32 pb-24 px-6 md:px-12 wrapper">
      <article className="max-w-3xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-meshark-silver hover:text-white transition-colors mb-8 font-mono text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Insights
        </Link>
        
        <header className="mb-12 pb-8 border-b border-white/10">
          <div className="flex gap-2 flex-wrap mb-6">
            {post.tags.map(tag => (
              <span key={tag} className="px-3 py-1 text-[11px] font-mono uppercase bg-meshark-cyan/10 text-meshark-cyanLight rounded-full border border-meshark-cyan/20">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-6 leading-tight">
            {post.title}
          </h1>
          <time className="text-sm font-mono text-meshark-silverLight/50 block">
            Published on {post.date ? format(new Date(post.date), 'MMMM dd, yyyy') : 'Recently'}
          </time>
        </header>

        <div className="max-w-none">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-display font-bold text-white mt-12 mb-6" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold text-white mt-8 mb-4 border-l-2 border-meshark-cyan pl-3" {...props} />,
              p: ({node, ...props}) => <p className="text-meshark-silver leading-relaxed mb-6 text-[17px]" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-outside pl-5 text-meshark-silver mb-6 text-[17px] space-y-2 marker:text-meshark-cyan" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-outside pl-5 text-meshark-silver mb-6 text-[17px] space-y-2 marker:text-meshark-cyan" {...props} />,
              li: ({node, ...props}) => <li className="pl-1" {...props} />,
              a: ({node, ...props}) => <a className="text-meshark-cyan underline decoration-meshark-cyan/40 hover:text-white shadow-sm transition-colors" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-meshark-cyan/50 pl-6 my-8 italic text-meshark-silverLight/80 bg-meshark-cyan/5 py-4 pr-4 rounded-r-lg" {...props} />,
              code(props) {
                const {children, className, node, ...rest} = props;
                const match = /language-(\w+)/.exec(className || '');
                return match ? (
                  <pre className="block bg-[#0d1117] text-meshark-silverLight p-6 rounded-xl font-mono text-sm overflow-x-auto border border-white/10 my-8 shadow-xl">
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className="bg-white/10 text-meshark-cyanLight px-1.5 py-0.5 rounded font-mono text-[14px]" {...rest}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
