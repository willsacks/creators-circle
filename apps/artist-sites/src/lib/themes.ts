export const themes = {
  'sage-dark': {
    bg: '#0E0D0C',
    surface: '#1A1815',
    text: '#F5F0E8',
    accent: '#C4892A',
    muted: '#8A8278',
    fontHeading: '"Cormorant Garamond", Georgia, serif',
    fontBody: 'Inter, system-ui, sans-serif',
    navBg: 'rgba(14,13,12,0.85)',
  },
  'sage-light': {
    bg: '#FAF8F5',
    surface: '#F0EDE7',
    text: '#1A1815',
    accent: '#C4892A',
    muted: '#6B6560',
    fontHeading: '"Cormorant Garamond", Georgia, serif',
    fontBody: 'Inter, system-ui, sans-serif',
    navBg: 'rgba(250,248,245,0.85)',
  },
  midnight: {
    bg: '#0A0C14',
    surface: '#141820',
    text: '#E8EAF0',
    accent: '#7B8FD4',
    muted: '#6068A8',
    fontHeading: '"Playfair Display", Georgia, serif',
    fontBody: 'Inter, system-ui, sans-serif',
    navBg: 'rgba(10,12,20,0.85)',
  },
  earth: {
    bg: '#1C1612',
    surface: '#2A211A',
    text: '#F0E8D8',
    accent: '#9E6B3F',
    muted: '#7A6050',
    fontHeading: '"Lora", Georgia, serif',
    fontBody: 'Inter, system-ui, sans-serif',
    navBg: 'rgba(28,22,18,0.85)',
  },
} as const

export type ThemeId = keyof typeof themes

export function getTheme(themeId: string) {
  return themes[themeId as ThemeId] ?? themes['sage-dark']
}
