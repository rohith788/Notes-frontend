import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import CssBaseline from "@material-ui/core/CssBaseline";

import { DarkThemeProvider } from "./context/darkTheme";

const httpLink = createHttpLink({
  uri: "https://tranquil-island-57686.herokuapp.com/",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <DarkThemeProvider>
      <CssBaseline />
      <App />
    </DarkThemeProvider>
  </ApolloProvider>
);
