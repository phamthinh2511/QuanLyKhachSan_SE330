import React from "react";

interface PageSkeletonProps {
  type?: "table" | "dashboard" | "reports";
}

export default function PageSkeleton({ type = "table" }: PageSkeletonProps) {
  if (type === "dashboard") {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Stat Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded" />
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm lg:col-span-2 space-y-4">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
        </div>

        {/* Table/List skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="h-5 w-48 bg-gray-200 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                    <div className="h-3.5 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="h-4 w-12 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "reports") {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-6 w-36 bg-gray-200 rounded" />
            <div className="h-4 w-48 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Date Filters skeleton */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1">
            <div className="h-10 w-32 bg-gray-200 rounded-xl" />
            <div className="h-10 w-32 bg-gray-200 rounded-xl" />
            <div className="h-10 w-24 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-10 w-28 bg-gray-200 rounded-xl" />
        </div>

        {/* Main Chart Card skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="flex gap-2">
              <div className="h-8 w-16 bg-gray-200 rounded-lg" />
              <div className="h-8 w-16 bg-gray-200 rounded-lg" />
            </div>
          </div>
          <div className="h-80 bg-gray-100 rounded-xl" />
        </div>

        {/* Bottom charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="h-5 w-40 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Default: "table" layout
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100">
          <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-72 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Toolbar / Search + Filter skeleton */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 shadow-sm">
        <div className="h-10 bg-gray-200 rounded-xl flex-1" />
        <div className="h-10 w-36 bg-gray-200 rounded-xl" />
        <div className="h-10 w-28 bg-gray-200 rounded-xl" />
      </div>

      {/* Table grid skeleton */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <div className="grid grid-cols-6 gap-4">
            <div className="h-4 w-12 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded justify-self-end" />
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="p-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="h-4 w-8 bg-gray-200 rounded" />
                <div className="h-4 w-36 bg-gray-200 rounded" />
                <div className="h-4 w-48 bg-gray-200 rounded" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-6 w-16 bg-gray-200 rounded-full" />
                <div className="flex gap-2 justify-self-end">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                  <div className="w-8 h-8 bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
