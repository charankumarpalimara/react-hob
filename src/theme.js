import { createContext,  useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// color design tokens export
export const tokens = () => ({
  grey: {
    100: "#141414",
    200: "#292929",
    300: "#3d3d3d",
    400: "#525252",
    500: "#666666",
    600: "#858585",
    700: "#a3a3a3",
    800: "#c2c2c2",
    900: "#e0e0e0",
  },
  primary: {
    100: "#040509",
    200: "#a1a4ab",
    300: "#0c101b",
    400: "#f2f0f0",
    500: "#fffff",
    600: "#1F2A40",
    700: "#727681",
    800: "#a1a4ab",
    900: "#d0d1d5",
    1000: "#000",
  },
  greenAccent: {
    100: "#0f2922",
    200: "#1e5245",
    300: "#2e7c67",
    400: "#3da58a",
    500: "#4cceac",
    600: "#70d8bd",
    700: "#94e2cd",
    800: "#b7ebde",
    900: "#dbf5ee",
  },
  redAccent: {
    100: "#2c100f",
    200: "#58201e",
    300: "#832f2c",
    400: "#af3f3b",
    500: "#db4f4a",
    600: "#e2726e",
    700: "#e99592",
    800: "#f1b9b7",
    900: "#f8dcdb",
  },
  blueAccent: {
    100: "#e1e2fe",
    200: "#c3c6fd",
    300: "#a4a9fc",
    400: "#868dfb",
    500: "#3e4396",
    600: "#535ac8",
    700: "#3e4396",
    800: "#fffff",
    900: "#151632",
  },
});

// mui theme settings
export const themeSettings = () => {
  const colors = tokens();
  return {
    palette: {
      mode: "light",
      primary: {
        main: colors.primary[500],
      },
      secondary: {
        main: colors.greenAccent[500],
      },
      neutral: {
        dark: colors.grey[700],
        main: colors.grey[500],
        light: colors.grey[100],
      },
      background: {
        default: "#e8ecf1",
      },
    },
    typography: {
      fontFamily: [
        'Poppins',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      fontSize: 12,
      h1: {
        fontWeight: 700,
        fontSize: 40,
      },
      h2: {
        fontWeight: 700,
        fontSize: 32,
      },
      h3: {
        fontWeight: 600,
        fontSize: 24,
      },
      h4: {
        fontWeight: 600,
        fontSize: 20,
      },
      h5: {
        fontWeight: 500,
        fontSize: 16,
      },
      h6: {
        fontWeight: 500,
        fontSize: 14,
      },
      subtitle1: {
        fontWeight: 500,
        fontSize: 16,
      },
      subtitle2: {
        fontWeight: 400,
        fontSize: 14,
      },
      body1: {
        fontWeight: 400,
        fontSize: 16,
      },
      body2: {
        fontWeight: 400,
        fontSize: 14,
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
      caption: {
        fontWeight: 400,
      },
      overline: {
        fontWeight: 400,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const theme = useMemo(() => createTheme(themeSettings()), []);
  return [theme];
};
