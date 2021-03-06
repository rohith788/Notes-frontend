import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import AppBar from "@material-ui/core/AppBar";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { grey } from "@material-ui/core/colors";

import { AuthContext } from "../../context/auth";
import { ThemeContext } from "../../context/darkTheme";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    // color: "#607d8b",
  },
  // bar: { backgroundColor: "#ffffff" },
  title: {
    flexGrow: 1,
    display: "none",
    color: grey[400],
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  buttons: {
    // backgroundColor: "#ffffff ",
    borderColor: "#607d8b",
    margin: 3,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const history = useHistory();
  const { user, logout } = useContext(AuthContext);
  const { darkState, toggleDark } = useContext(ThemeContext);
  const LoginClick = () => {
    history.push("/login");
  };
  // const RegisterClick = () => {
  //   history.push("/register");
  // };

  return (
    <div className={classes.grow}>
      <AppBar className={classes.bar} position="static">
        <Toolbar>
          <Typography
            className={classes.title}
            component={"span"}
            variant="h6"
            href="/"
            noWrap
          >
            Keeps-Clone
          </Typography>
          <Switch
            color="primary"
            inputProps={{ "aria-label": "primary checkbox" }}
            checked={darkState}
            onChange={() => toggleDark(darkState)}
          />
          {user ? (
            <Button
              // className={classes.buttons}
              variant="outlined"
              onClick={logout}
            >
              Logout
            </Button>
          ) : (
            <div>
              <Button
                className={classes.buttons}
                variant="outlined"
                onClick={LoginClick}
              >
                Login
              </Button>
              {/* <Button
                className={classes.buttons}
                variant="outlined"
                onClick={RegisterClick}
              >
                Sign up
              </Button> */}
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
