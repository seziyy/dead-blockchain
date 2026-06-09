import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "rgb(var(--color-bg) / <alpha-value>)",
          surface: "rgb(var(--color-surface) / <alpha-value>)",
          elevated: "rgb(var(--color-elevated) / <alpha-value>)",
          text: "rgb(var(--color-text) / <alpha-value>)",
          muted: "rgb(var(--color-muted) / <alpha-value>)",
          line: "rgb(var(--color-line) / <alpha-value>)",
          accent: "rgb(var(--color-accent) / <alpha-value>)",
          teal: "#d71920",
          coral: "#d71920",
          blue: "#050505",
          lemon: "#e7e4db",
          violet: "#050505"
        },
        lab: {
          black: "#05070a",
          panel: "#fffdf6",
          line: "#050505",
          cyan: "#d71920",
          green: "#d71920",
          magenta: "#d71920",
          amber: "#d71920"
        }
      },
      boxShadow: {
        glow: "6px 6px 0 #000",
        magenta: "6px 6px 0 #000"
      },
      keyframes: {
        robotBlink: {
          "0%, 44%, 52%, 100%": { transform: "scaleY(1)" },
          "48%": { transform: "scaleY(0.22)" }
        },
        tinyBounce: {
          "0%, 100%": { transform: "translateY(0) rotate(-4deg)" },
          "50%": { transform: "translateY(-7px) rotate(4deg)" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" }
        },
        drift: {
          "0%": { transform: "translate3d(0,0,0)", opacity: "0.25" },
          "50%": { transform: "translate3d(16px,-18px,0)", opacity: "0.85" },
          "100%": { transform: "translate3d(0,0,0)", opacity: "0.25" }
        }
      },
      animation: {
        "robot-blink": "robotBlink 2.8s ease-in-out infinite",
        "tiny-bounce": "tinyBounce 2.4s ease-in-out infinite",
        scan: "scan 7s linear infinite",
        drift: "drift 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
