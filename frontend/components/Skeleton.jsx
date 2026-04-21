/**
 * Loading Skeleton Component
 * Placeholder while content loads
 */

'use client';

export function BookCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
      <div className="h-64 bg-gray-300" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-24" />
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-2/3" />
        <div className="h-10 bg-gray-300 rounded" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}
