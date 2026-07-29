import { createTheme } from "@mui/material/styles";

// Configuração do Tema Escuro (Dark Mode Premium)
// Utiliza uma paleta escura elegante (Slate / Indigo / Rose) e aproveitamento amplo de tela
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#6366f1", // Indigo 500
      light: "#818cf8",
      dark: "#4338ca",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f43f5e", // Rose 500
      light: "#fb7185",
      dark: "#e11d48",
    },
    background: {
      default: "#0b0f19", // Deep dark slate background
      paper: "#151c2c",   // Dark container background
    },
    text: {
      primary: "#f8fafc",   // Slate 50 (Texto claro)
      secondary: "#94a3b8", // Slate 400 (Texto secundário)
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#151c2c",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#151c2c",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.12)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(99, 102, 241, 0.5)",
          },
          "& input[type='date']": {
            colorScheme: "dark",
          },
          "& input[type='date']::-webkit-calendar-picker-indicator": {
            filter: "invert(1) !important",
            cursor: "pointer !important",
            opacity: 0.9,
            "&:hover": {
              opacity: 1,
            },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(255, 255, 255, 0.08)",
        },
      },
    },
  },
});

export default theme;
