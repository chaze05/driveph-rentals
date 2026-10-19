import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        night: "#0B0D12",
        graphite: "#14171F",
        card: "#181C26",
        lime: "#D6FF3F",
        "lime-dark": "#B8E01F",
        paper: "#F5F6F8",
        ink: "#0B0D12",
        line: "#E3E6EC",
        "line-dark": "#252A36",
        muted: "#5D6675",
        "muted-dark": "#8E98AA",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: { page: "1240px" },
    },
  },
  plugins: [],
};

export default config;
