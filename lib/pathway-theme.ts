export interface PathwayTheme {
    sigil: string
    color: string
    abbr: string
    cssVar: string
    image?: string
}

export const PATHWAY_THEMES: Record<string, PathwayTheme> = {
    'Demoness':          { sigil: '☽', color: '#c14a3a', abbr: 'DEM', cssVar: 'var(--p-demoness)',  image: '/pathways/demoness.webp' },
    'Door':              { sigil: '⌘', color: '#d6a23a', abbr: 'DOR', cssVar: 'var(--p-door)',      image: '/pathways/door.webp' },
    'Wheel of Fortune':  { sigil: '⊕', color: '#6fa04a', abbr: 'FOR', cssVar: 'var(--p-fortune)',   image: '/pathways/fortune.webp' },
    'Red Priest':        { sigil: '†', color: '#b85070', abbr: 'PRI', cssVar: 'var(--p-priest)',    image: '/pathways/priest.webp' },
    'Tyrant':            { sigil: '♆', color: '#4a6fb3', abbr: 'TYR', cssVar: 'var(--p-tyrant)',    image: '/pathways/tyrant.webp' },
    'Error':             { sigil: '∅', color: '#8a5cc4', abbr: 'ERR', cssVar: 'var(--p-error)',     image: '/pathways/error.webp' },
    'Sun':               { sigil: '☉', color: '#e09a2e', abbr: 'SUN', cssVar: 'var(--p-sun)',       image: '/pathways/sun.webp' },
    'Visionary':         { sigil: '◐', color: '#4a9aae', abbr: 'VIS', cssVar: 'var(--p-visionary)', image: '/pathways/visionary.webp' },
    'Paragon':           { sigil: '※', color: '#c9a653', abbr: 'PAR', cssVar: 'var(--p-paragon)',   image: '/pathways/paragon.webp' },
    'Twilight Giant':    { sigil: '☥', color: '#8a9ab8', abbr: 'TWI', cssVar: 'var(--p-twilight)', image: '/pathways/giant.webp' },
    'Hermit':            { sigil: '⚸', color: '#6a8a6a', abbr: 'HRM', cssVar: 'var(--p-hermit)',   image: '/pathways/hermit.webp' },
    'Chained':           { sigil: '⛓', color: '#8a8a8a', abbr: 'CHN', cssVar: 'var(--p-chained)',  image: '/pathways/chained.webp' },
    'Abyss':             { sigil: '⊗', color: '#2a3a5a', abbr: 'ABY', cssVar: 'var(--p-tyrant)',    image: '/pathways/abyss.webp' },
    'Darkness':          { sigil: '◈', color: '#3a2a4a', abbr: 'DRK', cssVar: 'var(--p-error)',     image: '/pathways/darkness.webp' },
    'Death':             { sigil: '☠', color: '#5a5a5a', abbr: 'DTH', cssVar: 'var(--p-chained)',   image: '/pathways/death.webp' },
    'Emperor':           { sigil: '♛', color: '#8a6a2a', abbr: 'EMP', cssVar: 'var(--p-door)',      image: '/pathways/emperor.webp' },
    'Black Emperor':     { sigil: '♛', color: '#8a6a2a', abbr: 'EMP', cssVar: 'var(--p-door)',      image: '/pathways/emperor.webp' },
    'Fool':              { sigil: '☆', color: '#5a8a9a', abbr: 'FOL', cssVar: 'var(--p-visionary)', image: '/pathways/fool.webp' },
    'Hanged Man':        { sigil: '⊹', color: '#7a5a8a', abbr: 'HNG', cssVar: 'var(--p-error)',     image: '/pathways/hanged.webp' },
    'Justiciar':         { sigil: '⚖', color: '#6a7a5a', abbr: 'JUS', cssVar: 'var(--p-hermit)',    image: '/pathways/justiciar.webp' },
    'Moon':              { sigil: '☾', color: '#5a6a9a', abbr: 'MON', cssVar: 'var(--p-visionary)', image: '/pathways/moon.webp' },
    'Mother':            { sigil: '♀', color: '#8a4a6a', abbr: 'MTH', cssVar: 'var(--p-demoness)',  image: '/pathways/mother.webp' },
    'Tower':             { sigil: '⌖', color: '#7a4a3a', abbr: 'TWR', cssVar: 'var(--p-tyrant)',    image: '/pathways/tower.webp' },
    'White Tower':       { sigil: '⌖', color: '#7a4a3a', abbr: 'TWR', cssVar: 'var(--p-tyrant)',    image: '/pathways/tower.webp' },
}

export const PATHWAY_UK_NAMES: Record<string, string> = {
    'Demoness':         'Демонеса',
    'Door':             'Брама',
    'Wheel of Fortune': 'Колесо Фортуни',
    'Red Priest':       'Червоний Жрець',
    'Tyrant':           'Тиран',
    'Error':            'Помилка',
    'Sun':              'Сонце',
    'Visionary':        'Провидець',
    'Paragon':          'Парагон',
    'Twilight Giant':   'Сутінковий Велетень',
    'Hermit':           'Відлюдник',
    'Chained':          'Прикутий',
    'Abyss':            'Безодня',
    'Darkness':         'Темрява',
    'Death':            'Смерть',
    'Emperor':          'Чорний Імператор',
    'Black Emperor':    'Чорний Імператор',
    'Fool':             'Блазень',
    'Hanged Man':       'Повішений',
    'Justiciar':        'Суддя',
    'Moon':             'Місяць',
    'Mother':           'Мати',
    'Tower':            'Біла Вежа',
    'White Tower':      'Біла Вежа',
}

export function getLocalizedPathwayName(name: string | null | undefined, locale: string): string {
    if (!name) return '—'
    if (locale === 'uk') return PATHWAY_UK_NAMES[name] ?? name
    return name
}

const DEFAULT_THEME: PathwayTheme = {
    sigil: '✦',
    color: '#c9a653',
    abbr: '···',
    cssVar: 'var(--gold)',
}

export function getPathwayTheme(name?: string | null): PathwayTheme {
    if (!name) return DEFAULT_THEME
    return PATHWAY_THEMES[name] ?? DEFAULT_THEME
}

export const ROMAN = [
    'I','II','III','IV','V','VI','VII','VIII','IX','X',
    'XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII',
]

export function toRoman(n: number): string {
    const map: [number, string][] = [
        [9,'IX'],[8,'VIII'],[7,'VII'],[6,'VI'],[5,'V'],
        [4,'IV'],[3,'III'],[2,'II'],[1,'I'],[0,'0'],
    ]
    const found = map.find(([v]) => v === n)
    return found ? found[1] : String(n)
}

export const RARITY_META: Record<string, { glyph: string; color: string }> = {
    COMMON:    { glyph: '○', color: '#a89b78' },
    UNCOMMON:  { glyph: '◐', color: '#6fa04a' },
    RARE:      { glyph: '◆', color: '#4a6fb3' },
    EPIC:      { glyph: '✦', color: '#8a5cc4' },
    LEGENDARY: { glyph: '✶', color: '#e09a2e' },
    MYTHICAL:  { glyph: '☼', color: '#c14a3a' },
}

export function getRarityMeta(rarity?: string | null) {
    if (!rarity) return { glyph: '○', color: '#a89b78' }
    return RARITY_META[rarity] ?? { glyph: '○', color: '#a89b78' }
}
