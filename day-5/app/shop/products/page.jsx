"use client"
import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const PRODUCTS_DATA = [
  {
    id: "1",
    name: "🎧 Premium Wireless Headphones",
    price: "$199",
    category: "Electronics",
    desc: "Active noise cancelling with 40-hour battery life and ultra-comfortable earcups."
  },
  {
    id: "2",
    name: "⌨️ Mechanical Gaming Keyboard",
    price: "$129",
    category: "Electronics",
    desc: "Tactile brown switches with custom RGB backlighting and aluminum frame."
  },
  {
    id: "3",
    name: "🪑 Ergonomic Mesh Office Chair",
    price: "$349",
    category: "Furniture",
    desc: "Full lumbar support with 3D armrests and breathable premium mesh."
  },
  {
    id: "999",
    name: "🎁 Out-of-Stock Mystery Product",
    price: "$99",
    category: "Special",
    desc: "A mystery package with cool items. Will trigger a redirect block when viewed!"
  }
]

const ProductsContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const errorMsg = searchParams.get("error")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter products based on search query
  const filteredProducts = PRODUCTS_DATA.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInteractiveView = (id) => {
    // Practice using useRouter programmatic navigation
    router.push(`/shop/products/${id}`)
  }

  return (
    <div>
      {/* Banner for redirect feedback */}
      {errorMsg === "mystery-box-unavailable" && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-800/80 text-red-200 rounded-xl flex items-center gap-2 animate-pulse">
          <span>⚠️</span>
          <span><strong>Access Denied:</strong> The Mystery Product (ID: 999) is currently out of stock. You were redirected back using the <code>redirect()</code> utility!</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            📦 Products Catalog
          </h1>
          <p className="text-slate-400 mt-1 font-mono text-sm">Practice: useRouter programmatic navigation</p>
        </div>

        {/* Search box to show interactive input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search products or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="p-6 bg-slate-950/60 border border-slate-850 rounded-2xl hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400 rounded-full">
                  {product.category}
                </span>
                <span className="text-xl font-bold text-emerald-400 font-mono">{product.price}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors mb-2">
                {product.name}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                {product.desc}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Button practicing useRouter */}
              <button
                onClick={() => handleInteractiveView(product.id)}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-950/20 active:scale-95 cursor-pointer text-center"
              >
                View Details (useRouter)
              </button>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}

const ProductsPage = () => {
  return (
    <Suspense fallback={<div className="text-slate-500 font-mono text-sm">Loading products catalog...</div>}>
      <ProductsContent />
    </Suspense>
  )
}

export default ProductsPage