const plugin = require('tailwindcss/plugin')

const config = {
  mode: "jit",
  purge: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {},
  },

  plugins: [
    plugin(({ addVariant, e }) => {
      addVariant('alt', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.alt .${e(`alt${separator}${className}`)}`;
        });
      });
    })
  ]
};

module.exports = config;
