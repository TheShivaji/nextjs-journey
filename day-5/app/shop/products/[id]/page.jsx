"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter, redirect } from 'next/navigation'

const PRODUCTS_DATA = {
  "1": {
    id: "1",
    name: "🎧 Premium Wireless Headphones",
    price: "$199",
    category: "Electronics",
    desc: "Active noise cancelling with 40-hour battery life and ultra-comfortable earcups.",
    details: "These headphones represent the pinnacle of consumer audio technology. Designed with high-fidelity custom drivers, advanced Hybrid Active Noise Cancelation (ANC), and premium memory foam cushions. Includes a hard shell carrying case, 3.5mm AUX cable, and a USB-C charging cable."
  },
  "2": {
    id: "2",
    name: "⌨️ Mechanical Gaming Keyboard",
    price: "$129",
    category: "Electronics",
    desc: "Tactile brown switches with custom RGB backlighting and aluminum frame.",
    details: "Elevate your typing and gaming experience. Outfitted with high-durability mechanical switches rated for 80 million keystrokes. Fully programmable keys, dedicated media controls, and double-shot PBT keycaps for a typing feel that lasts for years without fading."
  },
  "3": {
    id: "3",
    name: "🪑 Ergonomic Mesh Office Chair",
    price: "$349",
    category: "Furniture",
    desc: "Full lumbar support with 3D armrests and breathable premium mesh.",
    details: "Engineered to promote healthy posture during long hours of work. Features an adjustable dynamic lumbar support piece that automatically responds to your weight, a multi-angle recline mechanism, fully adjustable 3D armrests, and a heavy-duty chrome base."
  }
}

const ProductDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const id = params.id
  
  // 1. PRACTICE redirect() hook inside Client Component during render
  // If the user tries to access ID 999 (Mystery Box), redirect them back with search parameters
  if (id === "999") {
    redirect("/shop/products?error=mystery-box-unavailable")
  }
  
  const product = PRODUCTS_DATA[id]
  
  // If the product doesn't exist in our records, redirect them back to the list
  if (!product) {
    redirect("/shop/products")
  }
  
  // For logging router actions visually on screen (interactive logs for the learning session!)
  const [actionLog, setActionLog] = useState([])
  const logAction = (msg) => {
    setActionLog((prev) => [
      { time: new Date().toLocaleTimeString(), message: msg },
      ...prev
    ])
  }
  
  const handleOrder = () => {
    logAction(`Executing: router.push('/shop/orders?product=${id}')`)
    setTimeout(() => {
      router.push(`/shop/orders?product=${id}`)
    }, 800)
  }
  
  const handleReplace = () => {
    logAction(`Executing: router.replace('/shop/Dashboard')`)
    setTimeout(() => {
      router.replace('/shop/Dashboard')
    }, 800)
  }
  
  const handleRefresh = () => {
    logAction(`Executing: router.refresh()`)
    router.refresh()
    logAction("Page cache refreshed successfully!")
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Dynamic Parameter Header */}
      <div className="mb-6 p-4 bg-indigo-950/40 border border-indigo-900/60 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-indigo-400 font-mono">
            📍 Dynamic Route Params Extracted (useParams):
          </h2>
          <p className="text-xl font-bold font-mono text-indigo-200 mt-1">
            params.id = &quot;{id}&quot;
          </p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-xl text-sm transition-colors cursor-pointer"
        >
          ← Back (router.back())
        </button>
      </div>
      
      {/* Main Product Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 p-8 bg-slate-950/60 border border-slate-850 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400 rounded-full">
                {product.category}
              </span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">{product.price}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 mb-4">{product.name}</h1>
            <p className="text-slate-350 text-sm leading-relaxed mb-6 font-semibold">
              {product.desc}
            </p>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</h4>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {product.details}
            </p>
          </div>
          
          {/* Interactive Buy Button */}
          <button
            onClick={handleOrder}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-950/20 cursor-pointer text-center"
          >
            Order This Item (router.push)
          </button>
        </div>
        
        {/* Practice Panel for useRouter */}
        <div className="p-6 bg-slate-950/80 border border-slate-850 rounded-3xl">
          <h3 className="text-base font-bold text-slate-100 mb-4">⚙️ useRouter Actions</h3>
          
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={handleRefresh}
              className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 rounded-xl text-xs font-mono font-medium transition-all text-left flex justify-between items-center cursor-pointer"
            >
              <span>router.refresh()</span>
              <span className="text-slate-500">Refresh Cache</span>
            </button>
            
            <button
              onClick={handleReplace}
              className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 rounded-xl text-xs font-mono font-medium transition-all text-left flex justify-between items-center cursor-pointer"
            >
              <span>router.replace(&apos;/shop/Dashboard&apos;)</span>
              <span className="text-slate-500">No History</span>
            </button>
            
            <button
              onClick={() => {
                logAction("Executing: router.push('/shop/products')")
                setTimeout(() => router.push('/shop/products'), 500)
              }}
              className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 rounded-xl text-xs font-mono font-medium transition-all text-left flex justify-between items-center cursor-pointer"
            >
              <span>router.push(&apos;/shop/products&apos;)</span>
              <span className="text-slate-500">Go List</span>
            </button>
          </div>
          
          {/* Console Log Panel */}
          <div className="border-t border-slate-900 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Navigation Logs</h4>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 h-32 overflow-y-auto text-[11px] font-mono text-indigo-400 flex flex-col gap-1.5">
              {actionLog.length === 0 ? (
                <span className="text-slate-600">Click actions above to trigger navigation and see logs...</span>
              ) : (
                actionLog.map((log, index) => (
                  <div key={index} className="flex gap-1.5 leading-tight">
                    <span className="text-slate-500">{log.time}</span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
