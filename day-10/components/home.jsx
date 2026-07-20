"use client";
import React from 'react'
import { authClient } from '@/lib/auth-client';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
const Homeview = () => {

    const { data: session } = authClient.useSession();
    const router = useRouter()



    if (!session) {

        return (
            <p>Loading...</p>
        )
    }

    return (
        <div className='flex flex-col p-4 gap-y-4'>
            <p>Logged in as {session.user.name}</p>
            <p>{session.user.email}</p>
            <img src={session.user.image} alt="" className='rounded-full w-12 h-12 object-contain' />

            <Button onClick={() => authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login")
                        toast.success("Signed out successfully")
                    }

                }
            })}>
                Sign Out
            </Button>
        </div>
    )
}

export default Homeview