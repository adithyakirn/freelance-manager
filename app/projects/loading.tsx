export default function Loading() {
  return (
    <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-white/5 rounded-lg" />
          <div className="h-4 w-48 bg-white/5 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-lg" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-1 mb-8">
        <div className="h-10 w-24 bg-white/5 rounded-lg" />
        <div className="h-10 w-24 bg-white/5 rounded-lg" />
        <div className="h-10 w-24 bg-white/5 rounded-lg" />
      </div>

      {/* Projects Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/5 rounded-xl p-5 h-[200px]"
          />
        ))}
      </div>
    </div>
  );
}
