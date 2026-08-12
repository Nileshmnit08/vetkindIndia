export default function Loading() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent dark:border-green-500 dark:border-t-transparent"></div>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Loading Research...</p>
      </div>
    </div>
  );
}





