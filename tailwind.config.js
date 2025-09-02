/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    container: {
      center: true
    },
    screens: {
      'sMobile': '320px',
      'mobile': '480px',
      'tablet': '640px',
      'laptop': '1024px',
      'laptopL': '1366px',
      'desktop': '1600px',

      // layout
      'b500': "500px",
    },
    extend: {
      colors: {
        red: {
          1: "#C6302C"
        },
        "primary": {
          DEFAULT: "#343DFF",
          40: "#396EF2",
          50: "#5A64FF",
          95: "#F1EFFF",
          100: "#0000FF",
        },
        "secondary": {
          "light": "#595E72",
          DEFAULT: "#DCD9DE",
          50: "#75758B",
          100: "#E1E0F9",
          200: "#d1d0e8",
          900: "#191A2C",
        },
        "outline": {
          DEFAULT: "#777680",
          600: "#757680",
          "light": "#C7C5D0"
        },
        "surface": {
          DEFAULT: "#F0EDF1",
          1: "#FCF8FD",
          2: "#e5e7ebe3",
          10: "#1B1B1F",
          20: "#46464F",
          "light": "#46464F29"
        },
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif']
      }
    },
  },
  plugins: [
  ],
}

