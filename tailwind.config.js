const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...fontFamily.sans],
        serif: ["Cormorant Garamond", ...fontFamily.serif],
        brand: ["Great Vibes", "cursive"],
        decorative: ["Dancing Script", "cursive"],
        elegant: ["Cormorant Garamond", ...fontFamily.serif],
        cute: ["Poppins", ...fontFamily.sans],
      },
      fontSize: {
        'brand-sm': ['1.5rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'brand-md': ['2rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'brand-lg': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'brand-xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
      },
      borderRadius: {
        DEFAULT: "8px",
        secondary: "4px",
        container: "12px",
        cute: "16px",
        girlie: "20px",
      },
      boxShadow: {
        DEFAULT: "0 1px 4px rgba(0, 0, 0, 0.1)",
        hover: "0 2px 8px rgba(0, 0, 0, 0.12)",
        girlie: "0 8px 32px rgba(147, 51, 234, 0.1)",
        "girlie-hover": "0 12px 40px rgba(147, 51, 234, 0.15)",
        cute: "0 4px 20px rgba(236, 72, 153, 0.1)",
      },
      colors: {
        primary: {
          DEFAULT: "#7c3aed",
          hover: "#6d28d9",
          light: "#a855f7",
          dark: "#5b21b6",
        },
        secondary: {
          DEFAULT: "#6B7280",
          hover: "#4B5563",
        },
        accent: {
          DEFAULT: "#ec4899",
          hover: "#db2777",
          light: "#f472b6",
          dark: "#be185d",
        },
        girlie: {
          cream: "#FFF6E9",
          purple: "#7c3aed",
          pink: "#ec4899",
          lavender: "#ddd6fe",
          blush: "#fce7f3",
        },
      },
      spacing: {
        "form-field": "16px",
        section: "32px",
        "girlie-sm": "12px",
        "girlie-md": "20px",
        "girlie-lg": "32px",
      },
      backdropBlur: {
        girlie: "10px",
      },
    },
  },
  variants: {
    extend: {
      boxShadow: ["hover", "active"],
      transform: ["hover", "active"],
      scale: ["hover", "active"],
    },
  },
};
