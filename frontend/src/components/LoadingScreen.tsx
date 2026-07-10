export default function LoadingScreen() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 text-zinc-950 select-none font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-950" />
        <p className="text-sm text-zinc-400 font-bold tracking-wide">Checking session...</p>
      </div>
    </main>
  );
}
