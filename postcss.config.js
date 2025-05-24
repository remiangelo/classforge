module.exports = {
  plugins: [
    require('postcss-import'),
    // Make sure the postcss-nesting plugin is before tailwindcss
    require('postcss-nesting'),
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [require('cssnano')] : []),
  ],
};
