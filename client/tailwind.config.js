module.exports = {
  daisyui: {
    themes: [  
      { cupcake: {
        "color-scheme": "light",
        "primary": "#65c3c8",
        "secondary": "#BBB0F8",
        "accent": "#eeaf3a",
        "neutral": "#291334",
        "base-100": "#faf7f5",
        "base-200": "#efeae6",
        "base-300": "#e7e2df",
        "base-content": "#291334",
        "--rounded-btn": "1.9rem",
        "--tab-border": "2px",
        "--tab-radius": "0.7rem",
      }}
    ]
  },
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    plugins: [
      require('daisyui'), 
      require('@tailwindcss/typography')
    ],
    theme: {
      extend: {
        fontFamily: {
          merriweather: ['Merriweather', 'serif'],
          manrope: ['Manrope', 'sans-serif'],
          proximanova: ['Proxima-Nova', 'sans-serif'],
        },
        // Extended colors for cupcake theme
        colors: {
          primary: {
            DEFAULT: '#65c3c8',
            300: '#c1e7e9',
            700: '#3ba0a5',
          },
          secondary: {
            DEFAULT: '#BBB0F8',
            300: '#ddd7fb',
            700: '#7f6af2',
          },
          accent: {
            DEFAULT: '#eeaf3a',
            300: '#f8dfb0',
            700: '#ca8911',
          },
        },
      },
    },
  };