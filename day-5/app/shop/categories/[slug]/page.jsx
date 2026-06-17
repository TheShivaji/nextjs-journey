"use client"
import React from 'react'
import { useParams, useRouter, redirect } from 'next/navigation'

const PRODUCTS_DATA = [
  {
    id: "1",
    name: "🎧 Premium Wireless Headphones",
    price: "$199",
    category: "electronics"
  },
  {
    id: "2",
    name: "⌨️ Mechanical Gaming Keyboard",
    price: "$129",
    category: "electronics"
  },
  {
    id: "3",
    name: "🪑 Ergonomic Mesh Office Chair",
    price: "$349",
    category: "furniture"
  }
]

const CategoryDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug

  // 1. PRACTICE redirect() inside Client Component on slug matching
  if (slug === "deprecated") {
    redirect("/shop/categories?error=deprecated")
  }

  // Filter products by category slug
  const filteredProducts = PRODUCTS_DATA.filter(p => p.category === slug)

  // Capitalize name for UI
  const displayTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : ""

  return (
    <div className="max-w-4xl mx-auto">
      {/* Parameter Header */}
      <div className="mb-6 p-4 bg-indigo-950/40 border border-indigo-900/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-indigo-400 font-mono">
            📍 Dynamic Route Params Extracted (useParams):
          </h2>
          <p className="text-xl font-bold font-mono text-indigo-200 mt-1">
            params.slug = &quot;{slug}&quot;
          </p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-xl text-sm transition-colors cursor-pointer"
        >
          ← Back to Categories
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">
          Explore Category: <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">{displayTitle}</span>
        </h1>
        <p className="text-slate-400 mt-1 font-mono text-sm">Products categorized under &quot;{slug}&quot;</p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="p-6 bg-slate-950/60 border border-slate-850 rounded-2xl hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xl font-extrabold text-emerald-400 font-mono">{product.price}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-6">
                  {product.name}
                </h3>
              </div>

              <button
                onClick={() => router.push(`/shop/products/${product.id}`)}
                className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer text-center"
              >
                Inspect Details (router.push)
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
          No products currently listed under this category.
        </div>
      )}
    </div>
  )
}

export default CategoryDetailPage
