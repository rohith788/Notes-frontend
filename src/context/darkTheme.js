import React, { useState, createContext } from "react";
// import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const defaultState = {
  dark: false,
  toggleDark: () => {},
};

const ThemeContext = createContext(defaultState);

const DarkThemeProvider = ({ children }) => {
  let darkness = false;
  if (localStorage.getItem("darkTheme")) {
    darkness = localStorage.getItem("darkTheme");
  }
  //   console.log(darkness);
  const [dark, setDarkState] = useState(darkness);
  const toggleDark = () => {
    setDarkState(!dark);
    localStorage.setItem("darkTheme", !dark);
  };

  const darkTheme = createMuiTheme({
    palette: {
      type: dark ? "dark" : "light",
    },
  });
  //   console.log(dark);
  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, DarkThemeProvider };
