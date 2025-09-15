'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useAuth } from '@/lib/hooks/use-auth'
import { useRecentActions, useActionsByType } from '@/lib/hooks/use-actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Shield,
    Clock,
    User,
    MessageSquare,
    BookOpen,
    Compass,
    Package,
    UserPlus,
    Activity,
    Filter,
    RefreshCw
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { ActionType, ActionDto } from '@/lib/types'
import { redirect } from 'next/navigation'

const actionTypeIcons = {
    CREATE_COMMENT: MessageSquare,
    EDIT_COMMENT: MessageSquare,
    DELETE_COMMENT: MessageSquare,
    CREATE_ITEM: BookOpen,
    EDIT_ITEM: BookOpen,
    DELETE_ITEM: BookOpen,
    CREATE_PATHWAY: Compass,
    EDIT_PATHWAY: Compass,
    DELETE_PATHWAY: Compass,
    CREATE_TYPE: Package,
    EDIT_TYPE: Package,
    DELETE_TYPE: Package,
    CREATE_RESEARCHER: UserPlus,
    EDIT_RESEARCHER: UserPlus,
    DELETE_RESEARCHER: UserPlus,
    CREATE_ACTION: Activity,
    EDIT_ACTION: Activity,
    DELETE_ACTION: Activity,
}

const actionTypeColors = {
    CREATE_COMMENT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    EDIT_COMMENT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    DELETE_COMMENT: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    CREATE_ITEM: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    EDIT_ITEM: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    DELETE_ITEM: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    CREATE_PATHWAY: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    EDIT_PATHWAY: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    DELETE_PATHWAY: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    CREATE_TYPE: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    EDIT_TYPE: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    DELETE_TYPE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    CREATE_RESEARCHER: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    EDIT_RESEARCHER: 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
    DELETE_RESEARCHER: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    CREATE_ACTION: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    EDIT_ACTION: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
    DELETE_ACTION: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
}

interface ActionCardProps {
    action: ActionDto
}

function ActionCard({ action }: ActionCardProps) {
    const Icon = actionTypeIcons[action.actionType]
    const colorClass = actionTypeColors[action.actionType]

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                            {action.researcher.nickname.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{action.researcher.nickname}</span>
                            <Badge className={`text-xs ${colorClass}`}>
                                <Icon className="h-3 w-3 mr-1" />
                                {action.actionType.replace('_', ' ')}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDate(action.createdAt)}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function ModerationActionsPage() {
    const { canModerate } = useAuth()
    const [selectedType, setSelectedType] = useState<ActionType | 'all'>('all')
    const [limit, setLimit] = useState(50)

    // Redirect if not a moderator
    if (!canModerate()) {
        redirect('/')
    }

    const {
        data: recentActions,
        isLoading: loadingRecent,
        refetch: refetchRecent
    } = useRecentActions(selectedType === 'all' ? limit : undefined)

    const {
        data: filteredActions,
        isLoading: loadingFiltered,
        refetch: refetchFiltered
    } = useActionsByType(selectedType as ActionType)

    const actions = selectedType === 'all' ? recentActions : filteredActions
    const isLoading = selectedType === 'all' ? loadingRecent : loadingFiltered

    const handleRefresh = () => {
        if (selectedType === 'all') {
            refetchRecent()
        } else {
            refetchFiltered()
        }
    }

    const actionTypes: (ActionType | 'all')[] = [
        'all',
        'CREATE_ITEM', 'EDIT_ITEM', 'DELETE_ITEM',
        'CREATE_COMMENT', 'EDIT_COMMENT', 'DELETE_COMMENT',
        'CREATE_PATHWAY', 'EDIT_PATHWAY', 'DELETE_PATHWAY',
        'CREATE_TYPE', 'EDIT_TYPE', 'DELETE_TYPE',
        'CREATE_RESEARCHER', 'EDIT_RESEARCHER', 'DELETE_RESEARCHER',
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-6 w-6 text-red-600" />
                    <h1 className="text-3xl font-bold">Action Logs</h1>
                </div>
                <p className="text-muted-foreground">
                    Monitor all researcher activities on the platform
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ActionType | 'all')}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filter by action type" />
                        </SelectTrigger>
                        <SelectContent>
                            {actionTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type === 'all' ? 'All Actions' : type.replace('_', ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedType === 'all' && (
                    <Select value={limit.toString()} onValueChange={(value) => setLimit(parseInt(value))}>
                        <SelectTrigger className="w-24">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="200">200</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                </Button>
            </div>

            {/* Actions List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="h-20 p-4" />
                        </Card>
                    ))}
                </div>
            ) : actions && actions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {actions.map((action) => (
                        <ActionCard key={action.id} action={action} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-12">
                        <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            No actions found
                            {selectedType !== 'all' && ` for ${selectedType.replace('_', ' ')}`}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}