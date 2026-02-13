export default function Loading() {
  return (
    <div className="min-h-screen p-4 lg:p-6 pt-16 lg:pt-8 animate-pulse text-foreground max-w-7xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="h-4 w-64 bg-white/5 rounded-lg" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-32 bg-white/5 rounded-xl" />
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`bg-white/5 border border-white/5 rounded-xl p-5 h-32 ${
              i === 0 ? "md:col-span-2 lg:col-span-1" : ""
            }`}
          />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Chart Skeleton */}
          <div className="bg-white/5 border border-white/5 rounded-xl h-[400px]" />
          {/* Project Status Chart Skeleton */}
          <div className="bg-white/5 border border-white/5 rounded-xl h-[300px]" />
        </div>

        {/* Right Column - Recent Activity */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/5 rounded-xl h-[700px] lg:h-full" />
        </div>
      </div>
    </div>
  );
}
