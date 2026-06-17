"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Slidebar = () => {
    const pathname = usePathname()
    const navItems = [
        {
            label: "📦 Products",
            href: "/shop/products"
        },
        {
            label: "🗂️ Categories",
            href: "/shop/categories"
        },
        {
            label: "🛒 Orders",
            href: "/shop/orders"
        },
        {
            label: "📊 Dashboard",
            href: "/shop/Dashboard"
        }
    ]

    return (
        <div className="w-64 h-full bg-slate-950 text-slate-100 p-6 flex flex-col justify-between border-r border-slate-900">
            <div>
                <div className="mb-8">
                    <h2 className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        LEARNING SHOP
                    </h2>
                    <p className="text-xs text-slate-500 font-mono mt-1">Next.js Day 5 Hooks Practice</p>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                        // Match active path (supports subroutes like /shop/products/[id])
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                href={item.href}
                                key={item.href}
                                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-between ${
                                    isActive
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/30 translate-x-1"
                                        : "text-slate-450 hover:bg-slate-900 hover:text-slate-200"
                                }`}
                            >
                                <span>{item.label}</span>
                                {isActive && <span className="h-2 w-2 rounded-full bg-indigo-300 animate-pulse"></span>}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            <div className="border-t border-slate-900 pt-4 text-center">
                <Link
                    href="/"
                    className="text-xs text-slate-500 hover:text-indigo-400 transition-colors font-mono"
                >
                    ← Back to Root Home
                </Link>
            </div>
        </div>
    )
}

export default Slidebar