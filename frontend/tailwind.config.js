/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",  // Updated to include .ts and .tsx files
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      keyframes: {
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        'scroll-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        'shine': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        pulseGreen: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        pulseRed: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
        pulseYellow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      animation: {
        'scroll-left': 'scroll-left 20s linear infinite',
        'scroll-right': 'scroll-right 20s linear infinite',
        'shine': 'shine 8s ease-in-out infinite',
        'shine-fast': 'shine 4s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 12s ease-in-out infinite',
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        "fade-in": "fadeIn 0.3s ease-in forwards",
        "slide-up": "slideUp 0.3s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-green": "pulseGreen 2s infinite",
        "pulse-red": "pulseRed 1.5s infinite",
        "pulse-yellow": "pulseYellow 2s infinite",
        "float-medium": "float 6s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
      },
      colors: {
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--destructive))",
        primary: "hsl(var(--primary))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
      }
    },
  },
  plugins: [],
}
