import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date))
}

export function getRarityColor(rarity?: string) {
    const colors = {
        COMMON: "text-rarity-common",
        UNCOMMON: "text-rarity-uncommon",
        RARE: "text-rarity-rare",
        EPIC: "text-rarity-epic",
        LEGENDARY: "text-rarity-legendary",
        MYTHICAL: "text-rarity-mythical",
    }
    return colors[rarity as keyof typeof colors] || "text-gray-500"
}

export function getRarityBgColor(rarity?: string) {
    const colors = {
        COMMON: "bg-rarity-common/10",
        UNCOMMON: "bg-rarity-uncommon/10",
        RARE: "bg-rarity-rare/10",
        EPIC: "bg-rarity-epic/10",
        LEGENDARY: "bg-rarity-legendary/10",
        MYTHICAL: "bg-rarity-mythical/10",
    }
    return colors[rarity as keyof typeof colors] || "bg-gray-500/10"
}