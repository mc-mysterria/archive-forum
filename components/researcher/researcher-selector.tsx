'use client'

import { useState, useEffect } from 'react'
import { useResearcherStore } from '@/lib/store/researcher-store'
import { useCreateResearcher } from '@/lib/hooks/use-researchers'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User } from 'lucide-react'

export function ResearcherSelector() {
    const { researcher, setResearcher } = useResearcherStore()
    const createResearcher = useCreateResearcher()
    const [open, setOpen] = useState(false)
    const [nickname, setNickname] = useState('')

    useEffect(() => {
        if (!researcher) {
            const storedNickname = localStorage.getItem('researcher-nickname')
            if (!storedNickname) {
                setOpen(true)
            }
        }
    }, [researcher])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (nickname.trim().length < 2) return

        try {
            const newResearcher = await createResearcher.mutateAsync({ nickname })
            setResearcher(newResearcher)
            localStorage.setItem('researcher-nickname', nickname)
            setOpen(false)
        } catch (error) {
            console.error('Failed to create researcher:', error)
        }
    }

    const handleLogout = () => {
        setResearcher(null)
        localStorage.removeItem('researcher-nickname')
        setOpen(true)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {researcher ? researcher.nickname : 'Select Researcher'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Enter Your Nickname</DialogTitle>
                        <DialogDescription>
                            Choose a nickname to identify yourself as a researcher in the archive.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nickname">Nickname</Label>
                            <Input
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="Enter your nickname..."
                                minLength={2}
                                maxLength={50}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between">
                        {researcher && (
                            <Button type="button" variant="outline" onClick={handleLogout}>
                                Switch User
                            </Button>
                        )}
                        <Button type="submit" disabled={createResearcher.isPending}>
                            {createResearcher.isPending ? 'Creating...' : 'Continue'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
