// tailwind.config.js
export default {
  theme: {
    extend: {
      keyframes: {
        wordfall: {
          "0%": {
            transform: "translateY(0)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(800vh)",
            opacity: "0",
          },
        },
      },
      animation: {
        wordfall: "wordfall 5s ease-in forwards",
      },
    },
  },
  plugins: [],
};
