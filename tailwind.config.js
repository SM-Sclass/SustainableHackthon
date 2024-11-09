/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screen:{
      sm:"340px",
      md:"540px",
      lg:"768px",
      xl:"1180px",
    },
    extend: {
      backgroundImage: {
        'custom-image': "url('/Sus2.jpg')",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
    container:{
      center:true,
      padding:{
        DEFAULT:"12px",
        md:"32px"
        
    },
    margin:{
        DEFAULT:"0",
        sm:"12px",
        md:"32px"
    }
  },
  fontFamily:{
    Poppins:["Poppins", "sans-serif"],
    Satisfy:["Satisfy", "cursive"]
  }

  },
  plugins: [],
}
