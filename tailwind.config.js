module.exports = {
  darkMode: 'class', // or 'media' if you prefer
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // adjust the path to your project's structure
  ],
 
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ['dark'],
  },
};
