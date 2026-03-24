export default function Loading() {
  return (
    <div className="min-h-screen bg-meshark-slateDark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-meshark-cyan/30 border-t-meshark-cyan rounded-full animate-spin glow-cyan" />
        <p className="text-meshark-silver font-mono text-xs tracking-widest animate-pulse">
          INITIALIZING_SYSTEM...
        </p>
      </div>
    </div>
  );
}
