"use client";

import { useEffect } from "react";
import { Terminal } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-meshark-slateDark flex flex-col items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 flex flex-col items-center text-center">
        <Terminal className="w-10 h-10 text-red-500 mb-4" />
        <h2 className="font-display text-2xl font-bold text-white mb-2">System Fault</h2>
        <p className="text-sm text-meshark-silver mb-8">
          A critical error occurred in the component tree. The engineering team has been notified.
        </p>
        <button onClick={() => reset()} className="btn-primary w-full justify-center">
          Execute Restart
        </button>
      </div>
    </div>
  );
}
