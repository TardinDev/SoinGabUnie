export const colors = {
  background: {
    primary: '#0B0C10',
    surface: '#121319',
    surfaceSecondary: '#161821',
  },
  text: {
    primary: '#E8EAF0',
    secondary: '#B4B8C5',
  },
  accent: {
    primary: '#8A5CF6',
    secondary: '#22C55E',
    alert: '#EF4444',
  },
  border: '#232634',
} as const;

export type ColorKey = keyof typeof colors;