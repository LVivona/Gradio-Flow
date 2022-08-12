/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./src/*.{html,js}"],
  darkMode : 'class',
  theme: {
    
    extend: {
     
      colors : {
        "Retro-light-blue" : "#2de2e6",
        "Retro-dark-blue" : "#035ee8",
        "Retro-light-pink" : "#f6019d",
        "Retro-dark-pink" : "#d40078",
        "Retro-purple" : "#9700cc",
        "Vapor-Violet" : "#300350",
        "Vapor-Purple" : "#94167f",
        "Vapor-Pink" : "#e93479",
        "Vapor-Orange" : "#f9ac53",
        "Vapor-Rose" : "#f62e97",
        "Vapor-Blue" : "#153cb4",
        'body' : "#17171F",
        'cream' : "#FAF9F6",
        "selected-text" : "#0053d7",
        "theme" : "#0053d7",
        "nav" : "#404053",
        "secondary" : "#9191A4",
        "badge" : "#3F3F51",
        "input-border" : "#565666",
        "input" : "#2A2A35",
        "dark-purple" : "#081A51",
        "light-white" : "rgba(255,255,255, 0.18)"
      },
    },
  },
  plugins: [],
}
