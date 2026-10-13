import type { Config } from "tailwindcss";

// Red & white — sampled from the G-TECH poster (#FE0000 bright, #D2090F core, #AC0403 deep).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          50: "#FFF2F2",
          100: "#FFE1E1",
          200: "#FFC7C7",
          300: "#FF9C9C",
          400: "#FF5C5C",
          500: "#F5222A",
          600: "#D2090F",
          700: "#AC0403",
          800: "#8A0606",
          900: "#5C0404",
          950: "#360202",
        },
        ink: { DEFAULT: "#1E1516", soft: "#4A3D3F", mute: "#7A6C6E" },
        mist: "#FBF6F6",
        line: "#F0E4E4",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sora)", "var(--font-manrope)", "ui-sans-serif", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(92,4,4,.05), 0 12px 32px -12px rgba(92,4,4,.18)",
        glow: "0 18px 50px -12px rgba(210,9,15,.55)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        floaty: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        dash: { to: { strokeDashoffset: "-70" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        floaty: "floaty 5s ease-in-out infinite",
        dash: "dash 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
