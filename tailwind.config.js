/** @type {import('tailwindcss').Config} */
function withOpacity(varName) {
  return `rgb(var(${varName}) / <alpha-value>)`;
}

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: withOpacity("--surface"),
          dim: withOpacity("--surface-dim"),
          bright: withOpacity("--surface-bright"),
          lowest: withOpacity("--surface-container-lowest"),
          low: withOpacity("--surface-container-low"),
          container: withOpacity("--surface-container"),
          high: withOpacity("--surface-container-high"),
          highest: withOpacity("--surface-container-highest"),
          variant: withOpacity("--surface-variant"),
        },
        "on-surface": {
          DEFAULT: withOpacity("--on-surface"),
          variant: withOpacity("--on-surface-variant"),
        },
        "inverse-surface": withOpacity("--inverse-surface"),
        "inverse-on-surface": withOpacity("--inverse-on-surface"),
        outline: {
          DEFAULT: withOpacity("--outline"),
          variant: withOpacity("--outline-variant"),
        },
        "surface-tint": withOpacity("--surface-tint"),
        primary: {
          DEFAULT: withOpacity("--primary"),
          on: withOpacity("--on-primary"),
          container: withOpacity("--primary-container"),
          "on-container": withOpacity("--on-primary-container"),
          fixed: withOpacity("--primary-fixed"),
          "fixed-dim": withOpacity("--primary-fixed-dim"),
          "on-fixed": withOpacity("--on-primary-fixed"),
          "on-fixed-variant": withOpacity("--on-primary-fixed-variant"),
        },
        "inverse-primary": withOpacity("--inverse-primary"),
        secondary: {
          DEFAULT: withOpacity("--secondary"),
          on: withOpacity("--on-secondary"),
          container: withOpacity("--secondary-container"),
          "on-container": withOpacity("--on-secondary-container"),
          fixed: withOpacity("--secondary-fixed"),
          "fixed-dim": withOpacity("--secondary-fixed-dim"),
          "on-fixed": withOpacity("--on-secondary-fixed"),
          "on-fixed-variant": withOpacity("--on-secondary-fixed-variant"),
        },
        tertiary: {
          DEFAULT: withOpacity("--tertiary"),
          on: withOpacity("--on-tertiary"),
          container: withOpacity("--tertiary-container"),
          "on-container": withOpacity("--on-tertiary-container"),
          fixed: withOpacity("--tertiary-fixed"),
          "fixed-dim": withOpacity("--tertiary-fixed-dim"),
          "on-fixed": withOpacity("--on-tertiary-fixed"),
          "on-fixed-variant": withOpacity("--on-tertiary-fixed-variant"),
        },
        error: {
          DEFAULT: withOpacity("--error"),
          on: withOpacity("--on-error"),
          container: withOpacity("--error-container"),
          "on-container": withOpacity("--on-error-container"),
        },
        background: withOpacity("--background"),
        "on-background": withOpacity("--on-background"),
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        sm: "0.5rem",
        DEFAULT: "1rem",
        md: "1.5rem",
        lg: "2rem",
        xl: "3rem",
      },
      spacing: {
        "container-max": "1200px",
        gutter: "1.5rem",
        "margin-mobile": "1rem",
        "margin-desktop": "2.5rem",
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "2rem",
      },
    },
  },
  plugins: [],
};
