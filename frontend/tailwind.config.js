/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
		keyframes:{
			"fade-in-up": {
				"0%": {
					opacity: 0,
					transform: "translate3d(0, 100%, 0)",
				},
				"100%": {
					opacity: 1,
					transform: "translate3d(0, 0, 0)",
				},
			},
		},
		animation:{
			fadeinup: 'fade-in-up 1s ease-in-out 0.25s 1',
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}

