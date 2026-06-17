"use client"
import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const PRODUCTS_DATA = {
  "1": { name: "🎧 Premium Wireless Headphones", price: "$199" },
  "2": { name: "⌨️ Mechanical Gaming Keyboard", price: "$129" },
  "3": { name: "🪑 Ergonomic Mesh Office Chair", price: "$349" }
}

const OrdersContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get("product")
  const orderedProduct = productId ? PRODUCTS_DATA[productId] : null

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          🛒 Your Orders
        </h1>
        <p className="text-slate-450 mt-1 font-mono text-sm">Practice: useSearchParams query parameters</p>
      </div>

      {orderedProduct ? (
        <div className="p-8 bg-slate-950/60 border border-emerald-900/60 rounded-3xl mb-6 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-emerald-950/80 text-emerald-400 rounded-full flex items-center justify-center text-3xl mb-4 border border-emerald-800 animate-bounce">
            ✓
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2">Order Placed Successfully!</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-sm">
            Thank you for your purchase. We have received your order and are processing it.
          </p>

          <div className="w-full bg-slate-950 p-4 rounded-2xl border border-slate-900 mb-6 text-left">
            <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-900">
              <span className="text-xs font-bold text-slate-500 uppercase">Product Details</span>
              <span className="text-xs font-bold text-slate-500 uppercase">Price</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-200">{orderedProduct.name}</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">{orderedProduct.price}</span>
            </div>
            <div className="mt-4 pt-2 border-t border-slate-900 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-mono">Order ID: #ORD-{Math.floor(1000 + Math.random() * 9000)}</span>
              <span className="text-xs text-indigo-400 font-mono">Status: Processing</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/shop/products")}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all cursor-pointer text-center"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="p-8 bg-slate-950/60 border border-slate-850 rounded-3xl text-center">
          <div className="text-slate-500 text-4xl mb-4">📭</div>
          <h3 className="text-lg font-bold text-slate-200 mb-2">No Active Orders</h3>
          <p className="text-sm text-slate-450 mb-6">
            You haven&apos;t placed any orders in this session. Head over to the products page to buy something!
          </p>
          <button
            onClick={() => router.push("/shop/products")}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all cursor-pointer text-center"
          >
            Browse Products (useRouter)
          </button>
        </div>
      )}
    </div>
  )
}

const OrdersPage = () => {
  return (
    <Suspense fallback={<div className="text-slate-500 font-mono text-sm">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  )
}

export default OrdersPage