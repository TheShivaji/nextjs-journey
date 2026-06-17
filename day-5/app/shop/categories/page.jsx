"use client"
import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const CATEGORIES_DATA = [
  {
    slug: "electronics",
    name: "🔌 Electronics",
    desc: "Gadgets, devices, mechanical keyboards, headphones, and more tech accessories.",
    count: 2
  },
  {
    slug: "furniture",
    name: "🛋️ Furniture",
    desc: "Ergonomic mesh chairs, adjustable standing desks, and office organizational items.",
    count: 1
  },
  {
    slug: "fashion",
    name: "👕 Fashion",
    desc: "Modern apparel, branded caps, bags, and lifestyle accessories.",
    count: 0
  },
  {
    slug: "deprecated",
    name: "⚠️ Deprecated Category",
    desc: "An old category that is disabled. Clicking will trigger a client-side redirect() back here!",
    count: 0,
    isDeprecated: true
  }
]

const CategoriesContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get("error")

  const handleCategoryClick = (slug) => {
    // Programmatic routing with useRouter
    router.push(`/shop/categories/${slug}`)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Alert banner if redirected from the deprecated category */}
      {errorMsg === "deprecated" && (
        <div className="mb-6 p-4 bg-amber-950/40 border border-amber-900 text-amber-200 rounded-xl flex items-center gap-2 animate-pulse">
          <span>⚠️</span>
          <span><strong>Redirect Success:</strong> The category you requested is deprecated. You were redirected using the <code>redirect()</code> hook in the dynamic category page!</span>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          🗂️ Product Categories
        </h1>
        <p className="text-slate-400 mt-1 font-mono text-sm">Practice: useParams dynamic route parameters & redirect()</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES_DATA.map((cat) => (
          <div 
            key={cat.slug} 
            onClick={() => handleCategoryClick(cat.slug)}
            className={`p-6 bg-slate-950/60 border rounded-3xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:scale-[1.01] hover:bg-slate-900 ${
              cat.isDeprecated 
                ? "border-red-950/45 hover:border-red-900/60" 
                : "border-slate-850 hover:border-indigo-650"
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  {cat.name}
                </h3>
                {!cat.isDeprecated ? (
                  <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-[10px] font-bold text-indigo-400 rounded-full">
                    {cat.count} Items
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 bg-red-950/80 border border-red-900 text-[10px] font-bold text-red-400 rounded-full animate-pulse">
                    Deprecated
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {cat.desc}
              </p>
            </div>
            
            <div className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 flex items-center gap-1">
              <span>Explore Category</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const CategoriesPage = () => {
  return (
    <Suspense fallback={<div className="text-slate-500 font-mono text-sm">Loading categories...</div>}>
      <CategoriesContent />
    </Suspense>
  )
}

export default CategoriesPage