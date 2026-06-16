import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        shelf: {
          void: 'var(--shelf-void)',
          surface: 'var(--shelf-surface)',
          elevated: 'var(--shelf-elevated)',
          border: 'var(--shelf-border)',
          muted: 'var(--shelf-muted)',
        },
        'shelf-text': {
          primary: 'var(--shelf-text-primary)',
          secondary: 'var(--shelf-text-secondary)',
          tertiary: 'var(--shelf-text-tertiary)',
        },
        accent: {
          DEFAULT: 'var(--shelf-accent)',
          dim: 'var(--shelf-accent-dim)',
          border: 'var(--shelf-accent-border)',
          hover: 'var(--shelf-accent-hover)',
        },
        success: 'var(--shelf-success)',
        danger: 'var(--shelf-danger)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        btn: '6px',
      },
    },
  },
  plugins: [],
}

export default config
