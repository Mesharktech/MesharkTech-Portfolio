"use client";

import { Terminal } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-meshark-slateDark text-white font-sans antialiased min-h-screen flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 flex flex-col items-center text-center border border-red-500/30 bg-red-500/5">
          <Terminal className="w-12 h-12 text-red-500 mb-5" />
          <h1 className="font-display text-2xl font-bold text-white mb-2">Fatal System Fault</h1>
          <p className="text-sm text-meshark-silver mb-8">
            The application encountered a catastrophic failure at the root level. Automatic recovery initiated.
          </p>
          <button 
            onClick={() => reset()} 
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors font-mono uppercase tracking-wider text-sm"
          >
            Execute Hard Restart
          </button>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-black/50 rounded-lg text-left w-full overflow-auto text-xs font-mono text-red-400">
              <p className="font-bold mb-2">Error Digest: {error.digest}</p>
              <pre>{error.message}</pre>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
