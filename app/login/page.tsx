'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            toast.error('Acceso denegado: Credenciales no válidas')
            setLoading(false)
            return
        }

        toast.success('Acceso concedido. Inicializando kernel...')
        router.push('/admin')
        router.refresh()
    }

    return (
        <div className="flex h-screen items-center justify-center bg-black font-mono">
            <Card className="w-[350px] border-zinc-800 bg-zinc-950 text-zinc-400">
                <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-widest text-zinc-500">
                        System Authentication
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Root User"
                            className="border-zinc-800 bg-black text-green-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Access Key"
                            className="border-zinc-800 bg-black text-green-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-800 hover:bg-zinc-700"
                        >
                            {loading ? 'Authenticating...' : 'Enter System'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}