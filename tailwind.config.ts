import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:   '#F8F5F1',
        secondary: '#DCCFC2',
        ink:       '#111111',
        accent:    '#8E7D6A',
        gold:      '#C7A76C',
        hairline:  '#E4DDD6',
        midnight:  '#1C1712',
        smoke:     '#7A746F',
        muted:     '#B8AFA7',
      },
      fontFamily: {
        display: ['TT Ramillas', 'Georgia', 'serif'],
        hero:    ['TT Ramillas', 'Georgia', 'serif'],
        product: ['Brolimo',  'Georgia', 'serif'],
        vogue:   ['Vogue',    'Georgia', 'serif'],
        sans:    ['var(--font-sans)',    'system-ui', 'sans-serif'],
        body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
      },
      fontSize: {
        '10xl': ['10rem',   { lineHeight: '1' }],
        '11xl': ['12rem',   { lineHeight: '1' }],
        '12xl': ['14rem',   { lineHeight: '1' }],
      },
      letterSpacing: {
        label:   '0.22em',
        widest:  '0.32em',
      },
      maxWidth: {
        '8xl': '1400px',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '600':  '600ms',
        '800':  '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
      },
    },
  },
  plugins: [],
};

export default config;
