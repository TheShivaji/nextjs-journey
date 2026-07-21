"use client";
import React from 'react'
import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const Homeview = ({ plan = "FREE" }) => {

    const { data: session } = authClient.useSession();
    const router = useRouter()

    if (!session) {
        return (
            <p className="text-slate-400">Loading user session...</p>
        )
    }

    const isPremium = plan === "PREMIUM";

    return (
        <div className='flex flex-col p-4 gap-y-4 text-slate-100'>
            <div className='flex items-center gap-4'>
                <img src={session.user.image || "/default-avatar.png"} alt="" className='rounded-full w-14 h-14 object-cover border-2 border-slate-700' />
                <div>
                    <div className='flex items-center gap-2'>
                        <h2 className='text-xl font-bold'>{session.user.name}</h2>
                        {isPremium ? (
                            <span className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-0.5 text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-violet-500/30 border border-violet-400/30">
                                ✨ PREMIUM
                            </span>
                        ) : (
                            <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-0.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                FREE PLAN
                            </span>
                        )}
                    </div>
                    <p className='text-sm text-slate-400'>{session.user.email}</p>
                </div>
            </div>

            <Button 
                className="w-fit mt-2 bg-rose-600 hover:bg-rose-700 text-white font-medium"
                onClick={() => authClient.signOut({
                    fetchOptions: {
                        onSuccess: () => {
                            router.push("/login")
                            toast.success("Signed out successfully")
                        }
                    }
                })}
            >
                Sign Out
            </Button>
        </div>
    )
}

export default Homeview