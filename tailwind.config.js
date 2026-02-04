const { themeColors } = require("./theme.config");
const plugin = require("tailwindcss/plugin");

const tailwindColors = Object.fromEntries(
  Object.entries(themeColors).map(([name, swatch]) => [
    name,
    {
      DEFAULT: `var(--color-${name})`,
      light: swatch.light,
      dark: swatch.dark,
    },
  ]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // Scan all component and app files for Tailwind classes
  content: ["./app/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}", "./lib/**/*.{js,ts,tsx}", "./hooks/**/*.{js,ts,tsx}"],

  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: tailwindColors,
      fontFamily: {
        'heading': ['Inter-Bold', 'Inter-SemiBold', 'system-ui', 'sans-serif'],
        'heading-medium': ['Inter-SemiBold', 'Inter-Medium', 'system-ui', 'sans-serif'],
        'heading-light': ['Inter-Medium', 'Inter-Regular', 'system-ui', 'sans-serif'],
        'body': ['Satoshi-Regular', 'system-ui', 'sans-serif'],
        'body-medium': ['Satoshi-Medium', 'Satoshi-Regular', 'system-ui', 'sans-serif'],
        'body-bold': ['Satoshi-Bold', 'Satoshi-Medium', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ':root:not([data-theme="dark"]) &');
      addVariant("dark", ':root[data-theme="dark"] &');
    }),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.glass': {
          'backdrop-filter': 'blur(8px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(8px)',
          'background-color': 'rgba(10, 10, 10, 0.7)',
          'border': '1px solid rgba(255, 255, 255, 0.08)',
        },
      });
    }),
  ],
};
