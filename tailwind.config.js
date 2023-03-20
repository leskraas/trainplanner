/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      spacing: {
        "safe-top": "env(safe-area-inset-top)",
        "safe-bottom": "env(safe-area-inset-bottom)",
        "safe-left": "env(safe-area-inset-left)",
        "safe-right": "env(safe-area-inset-right)",
        safe: "env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)",
      },
      screens: {
        standalone: { raw: "(display-mode: standalone)" },
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
    ({ addUtilities }) => {
      addUtilities({
        ".touch-iphone-fix": {
          "-webkit-touch-callout": "none",
        },
        ".tap-highlight-none": {
          "-webkit-tap-highlight-color": "transparent",
        },
        ".min-h-iphone-safe": {
          "@apply min-h-screen": {},
          "min-height": "-webkit-fill-available",
        },
        ".backface-visible": {
          "-webkit-backface-visibility": "visible",
          "backface-visibility": "visible",
        },
        ".backface-hidden": {
          "-webkit-backface-visibility": "hidden",
          "backface-visibility": "hidden",
        },
      });
    },
  ],
};
