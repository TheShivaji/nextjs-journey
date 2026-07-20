import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { LoginForm } from "@/components/login-form"

const LoginPage = async () => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!!session) return redirect('/')

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-black text-slate-100 overflow-hidden selection:bg-indigo-500 selection:text-white p-4 sm:p-6 md:p-10">
            {/* Ambient Background Glow Effects */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293712_1px,transparent_1px),linear-gradient(to_bottom,#1f293712_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    )
}

export default LoginPage






