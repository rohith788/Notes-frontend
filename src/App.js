import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import { AuthRoute, RootRoute } from "./utils/AuthRouter";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/menubar/menubar.component";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Router>
        <RootRoute exact path="/" component={Home} />
        <AuthRoute exact path="/login" component={Login} />
        <AuthRoute exact path="/register" component={Register} />
      </Router>
    </AuthProvider>
  );
}

export default App;
