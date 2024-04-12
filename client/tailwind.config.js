module.exports = {
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
        },
      },
    },
  };
  