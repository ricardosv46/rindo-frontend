/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        rindo: '#eef2f6',
        green: {
          300: '#B9F6CA99',
          600: '#00C853'
        },
        blue: {
          300: '#E2F2FD',
          600: '#2196F3'
        },
        yellow: {
          300: '#FFF8E1',
          600: '#FFC107'
        },
        red: {
          300: '#F5C8C3',
          600: '#F44336'
        },
        gray: {
          300: '#919EAB29',
          600: '#637381'
        },
        error: '#d32f2f',

        purple: {
          300: '#A98DCE99',
          600: '#693599'
        },
        primary: {
          300: '#A98DCE',
          600: '#693599',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          300: '#F4AD00',
          600: '#F49100',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        }
      },
      fontFamily: {
        gogh: ['Gogh', 'sans-serif'],
        'okine-sans': ['OkineSans', 'sans-serif']
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    }
  },

  plugins: [require('tailwindcss-animate')]
}
