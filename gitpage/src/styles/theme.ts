import { lightBlue, orange, purple, teal } from "@mui/material/colors";
import { Theme, createTheme } from "@mui/material/styles";

const generalTheme: Theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "@global": {
          ":root": {
            boxSizing: "border-box",
          },
          "*, ::before, ::after": {
            boxSizing: "inherit",
          },
        },
      },
    },
  },
  typography: {
    h1: {
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 500,
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 400,
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 400,
      lineHeight: 1.2,
    },
    caption: {
      lineHeight: 1.2,
    },
  },
});

export const lightTheme: Theme = createTheme(
  Object.assign(generalTheme, {
    palette: {
      mode: "light",
      secondary: {
        main: teal[500],
        light: teal[300],
        dark: teal[700],
      },
    },
  })
);

export const darkTheme: Theme = createTheme(
  Object.assign(generalTheme, {
    palette: {
      mode: "dark",
      secondary: {
        main: teal[200],
        light: teal[100],
        dark: teal[300],
      },
    },
  })
);

export const homeTheme = orange;
export const articleTheme = lightBlue;
export const blogTheme = teal;
export const projectTheme = purple;