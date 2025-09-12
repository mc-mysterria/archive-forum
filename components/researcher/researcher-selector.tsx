'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useResearcherStore } from '@/lib/store/researcher-store'
import { useCreateResearcher } from '@/lib/hooks/use-researchers'
import { researchersApi } from '@/lib/api/researchers'
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
import { useToast } from '@/components/ui/use-toast'

export function ResearcherSelector() {
    const { researcher, setResearcher } = useResearcherStore()
    const createResearcher = useCreateResearcher()
    const t = useTranslations('researchers')
    const tForm = useTranslations('form')
    const { toast } = useToast()
    const [open, setOpen] = useState(false)
    const [nickname, setNickname] = useState('')

    useEffect(() => {
        const loadStoredResearcher = async () => {
            if (!researcher) {
                const storedNickname = localStorage.getItem('researcher-nickname')
                if (storedNickname) {
                    try {
                        const existingResearcher = await researchersApi.getByNickname(storedNickname)
                        setResearcher(existingResearcher)
                    } catch (error) {
                        // Researcher no longer exists, clear storage and show dialog
                        localStorage.removeItem('researcher-nickname')
                        setOpen(true)
                    }
                } else {
                    setOpen(true)
                }
            }
        }
        
        loadStoredResearcher()
    }, [researcher, setResearcher])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (nickname.trim().length < 2) return

        try {
            // First, try to get an existing researcher by nickname
            let existingResearcher
            try {
                existingResearcher = await researchersApi.getByNickname(nickname)
            } catch (error) {
                // Researcher doesn't exist, will create new one
                existingResearcher = null
            }

            if (existingResearcher) {
                // Use existing researcher
                setResearcher(existingResearcher)
                localStorage.setItem('researcher-nickname', nickname)
                setOpen(false)
                toast({
                    title: t('welcomeBack'),
                    description: `${t('signedInAs')} ${nickname}`,
                })
            } else {
                // Create new researcher
                const newResearcher = await createResearcher.mutateAsync({ nickname })
                setResearcher(newResearcher)
                localStorage.setItem('researcher-nickname', nickname)
                setOpen(false)
                toast({
                    title: t('welcome'),
                    description: `${t('createdProfile')} ${nickname}`,
                })
            }
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
                    {researcher ? researcher.nickname : t('selectResearcher')}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{t('enterNickname')}</DialogTitle>
                        <DialogDescription>
                            {t('chooseNickname')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nickname">{tForm('nicknameLabel')}</Label>
                            <Input
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder={tForm('nicknamePlaceholder')}
                                minLength={2}
                                maxLength={50}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex justify-between">
                        {researcher && (
                            <Button type="button" variant="outline" onClick={handleLogout}>
                                {t('switchUser')}
                            </Button>
                        )}
                        <Button type="submit" disabled={createResearcher.isPending}>
                            {createResearcher.isPending ? tForm('creating') : tForm('continue')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
