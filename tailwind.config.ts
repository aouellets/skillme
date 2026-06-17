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
          'border-strong': 'var(--shelf-border-strong)',
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
          contrast: 'var(--shelf-on-accent)',
        },
        success: 'var(--shelf-success)',
        danger: 'var(--shelf-danger)',
        info: 'var(--shelf-info)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
        mono: 'var(--font-mono)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        btn: 'var(--radius-sm)',
      },
      maxWidth: {
        content: '88rem',
      },
    },
  },
  plugins: [],
}

export default config
