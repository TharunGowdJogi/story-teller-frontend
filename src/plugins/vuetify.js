// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Vuetify
import { createVuetify } from "vuetify";

const OCTheme = {
  dark: false,
  colors: {
    primary: "#5E9400",
    secondary: "#E1E1E1",
    accent: "rgba(140,198,38,1)",
    success: "#47121D",
    error: "#EE5044",
    teal: "#63BAC0",
    blue: "#196CA2",
    yellow: "#F8C545",
    darkblue: "#032F45",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "OCTheme",
    themes: {
      OCTheme,
    },
  },
});
