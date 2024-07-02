module.exports = {
  darkMode: 'class', // or 'media' if you prefer
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
 
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: ['dark'],
  },
 
};
