import React from 'react'
import Slidebar from '../components/slidebar'

const layout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
            <Slidebar />
            <main className="flex-1 p-8 overflow-y-auto bg-slate-900 border-l border-slate-850">
                {children}
            </main>
        </div>
    )
}

export default layout