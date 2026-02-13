export default function Loading() {
  return (
    <div className="min-h-screen p-4 lg:p-8 pt-16 lg:pt-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="h-4 w-64 bg-white/5 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-64 bg-white/5 rounded-lg hidden lg:block" />
          <div className="h-10 w-24 bg-white/5 rounded-lg" />
          <div className="h-10 w-32 bg-white/5 rounded-lg" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/5 rounded-xl p-5 h-32"
          />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 mb-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/5 rounded-xl h-[300px]" />
        <div className="bg-white/5 border border-white/5 rounded-xl h-[300px]" />
      </div>

      {/* Recent Activity Skeleton */}
      <div className="bg-white/5 border border-white/5 rounded-xl h-64" />
    </div>
  );
}
