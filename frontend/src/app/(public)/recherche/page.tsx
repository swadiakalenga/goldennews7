import { Suspense } from "react";
import type { Metadata } from "next";
import SearchContent from "@/components/search/SearchContent";
import SearchDropdown from "@/components/search/SearchDropdown";

export const metadata: Metadata = {
  title: "Recherche | GoldenNews7",
  description: "Recherchez parmi tous les articles de GoldenNews7.",
};

function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-20 bg-gray-100 rounded" />
            <div className="h-5 w-10 bg-gray-100 rounded" />
          </div>
          <div className="h-5 w-3/4 bg-gray-100 rounded mb-2" />
          <div className="h-4 w-full bg-gray-100 rounded mb-1" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function RecherchePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-6 bg-amber-500 rounded-full" />
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wide">Recherche</h1>
        </div>
        <p className="text-sm text-gray-500 mb-5">
          Recherchez parmi tous les articles de GoldenNews7
        </p>
        <SearchDropdown autoFocus />
      </div>
      <Suspense fallback={<SearchSkeleton />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
