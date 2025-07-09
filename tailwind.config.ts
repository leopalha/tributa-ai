import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        brand: {
          blue: {
            50: "#EEF5FF",
            100: "#D5E6FF",
            200: "#A8CDFF",
            300: "#5A9EFF",
            400: "#2E7DFF",
            500: "#1860FC",
            600: "#0048EB",
            700: "#0039BD",
            800: "#00309E",
            900: "#00277E",
          },
        },
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
          950: "#030712",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        heading: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-inter)", ...fontFamily.sans],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      spacing: {
        '9': '2.25rem',
        '12': '3rem',
      },
      width: {
        '9': '2.25rem',
      },
      height: {
        '9': '2.25rem',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'soft-md': '0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 8px 24px -4px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-out": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in": "slide-in 0.2s ease-out",
        "slide-out": "slide-out 0.2s ease-out",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "hsl(var(--foreground))",
            a: {
              color: "hsl(var(--primary))",
              "&:hover": {
                color: "hsl(var(--primary))",
              },
            },
            h1: {
              color: "hsl(var(--foreground))",
            },
            h2: {
              color: "hsl(var(--foreground))",
            },
            h3: {
              color: "hsl(var(--foreground))",
            },
            h4: {
              color: "hsl(var(--foreground))",
            },
            code: {
              color: "hsl(var(--foreground))",
            },
            "pre code": {
              backgroundColor: "hsl(var(--muted))",
              color: "hsl(var(--foreground))",
              borderRadius: "var(--radius)",
            },
            hr: {
              borderColor: "hsl(var(--border))",
            },
            ol: {
              listStyleType: "decimal",
            },
            "ol[type='A']": {
              listStyleType: "upper-alpha",
            },
            "ol[type='a']": {
              listStyleType: "lower-alpha",
            },
            "ol[type='A' s]": {
              listStyleType: "upper-alpha",
            },
            "ol[type='a' s]": {
              listStyleType: "lower-alpha",
            },
            "ol[type='I']": {
              listStyleType: "upper-roman",
            },
            "ol[type='i']": {
              listStyleType: "lower-roman",
            },
            "ol[type='I' s]": {
              listStyleType: "upper-roman",
            },
            "ol[type='i' s]": {
              listStyleType: "lower-roman",
            },
            "ol[type='1']": {
              listStyleType: "decimal",
            },
            ul: {
              listStyleType: "disc",
            },
            "ul > li > *:first-child": {
              marginTop: "1.25em",
            },
            "ul > li > *:last-child": {
              marginBottom: "1.25em",
            },
            "ol > li > *:first-child": {
              marginTop: "1.25em",
            },
            "ol > li > *:last-child": {
              marginBottom: "1.25em",
            },
            "ul ul, ul ol, ol ul, ol ol": {
              marginTop: "0.75em",
              marginBottom: "0.75em",
            },
            "hr + *": {
              marginTop: "0",
            },
            "h2 + *": {
              marginTop: "0",
            },
            "h3 + *": {
              marginTop: "0",
            },
            "h4 + *": {
              marginTop: "0",
            },
            h6: {
              color: "hsl(var(--muted-foreground))",
            },
            blockquote: {
              fontStyle: "italic",
              color: "hsl(var(--muted-foreground))",
              borderLeftWidth: "0.25rem",
              borderLeftColor: "hsl(var(--border))",
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
            },
            "blockquote p:first-of-type::before": {
              content: "open-quote",
            },
            "blockquote p:last-of-type::after": {
              content: "close-quote",
            },
            dd: {
              marginTop: "0.75em",
              marginBottom: "0.75em",
            },
            figure: {
              marginTop: "2em",
              marginBottom: "2em",
            },
            "figure > *": {
              marginTop: "0",
              marginBottom: "0",
            },
            figcaption: {
              color: "hsl(var(--muted-foreground))",
              fontSize: "0.875em",
              lineHeight: "1.4285714",
              marginTop: "0.8571429em",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate"),
  ],
};

export default config; 