import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
    const supabase = await createClient()

    // Obtenemos el perfil singleton
    const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .single()

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-black font-mono text-green-500">
            <div className="border border-green-900/30 bg-green-950/5 p-8 rounded-sm backdrop-blur-sm">
                <h1 className="text-2xl font-bold tracking-[0.2em] uppercase mb-4">
                    System Owner: {profile?.full_name || 'UNDEFINED'}
                </h1>
                <div className="h-[2px] w-full bg-green-900/50 mb-4" />
                <p className="text-xs uppercase tracking-widest text-green-700 mb-8">
                    Status: Online | Role: {profile?.role_title_en}
                </p>
                <div className="text-sm max-w-md leading-relaxed text-zinc-400">
                    {profile?.about_me_en || 'Loading system logs...'}
                </div>
            </div>
        </div>
    )
}