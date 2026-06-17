"use client"
import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
const DashboardContent = () => {
    const searchParams = useSearchParams()

    const tab = searchParams.get("tab") || "analytics"
  return (
    <div className='text-2xl font-bold mb-4'>
        <h1>Dashboard</h1>

        <div className='flex gap-4 mb-6'>
            <Link href="/shop/Dashboard?tab=analytics" className={`${tab === "analytics" ? "text-blue-600 border-b border-blue-600" : ""}`}>
            Analytics
            </Link>
            <Link href="/shop/Dashboard?tab=settings" className={`${tab === "settings" ? "text-blue-600 border-b border-blue-600" : ""}`}>
            Settings
            </Link>
            <Link href="/shop/Dashboard?tab=profile" className={`${tab === "profile" ? "text-blue-600" : ""}`}>
            Profile
            </Link>
            <Link href="/shop/Dashboard?tab=billing" className={`${tab === "billing" ? "text-blue-600" : ""}`}>
            Billing
            </Link>
        </div>
    
    </div>
  )
}

const Dashboard = () => {
  return (
    <Suspense fallback={<div className="text-slate-500 font-mono text-sm">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

export default Dashboard