// src/plugins/vuetify.js
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#1867C0",
          secondary: "#5CBBF6",
        },
      },
      dark: {
        colors: {
          primary: "#1E88E5",
          secondary: "#90CAF9",
        },
      },
    },
  },
});
