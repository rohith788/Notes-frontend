import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import NoteCard from "../components/card/card.component";
import NoteInputCard from "../components/note-input-card/note-input-card.component";

import { AuthContext } from "../context/auth";
import { FETCH_NOTES_QUERY } from "../utils/graphql";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_NOTES_QUERY);

  const classes = useStyles();

  return loading ? (
    <h1> Notes loading</h1>
  ) : (
    <div className={classes.root}>
      <Grid container justify="center">
        <NoteInputCard />
      </Grid>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        {user &&
          data.getNotes &&
          data.getNotes.map((note) => {
            if (note.username === user.username) {
              return (
                <Grid item key={note.id}>
                  {/* <Paper className={classes.paper}> */}
                  <NoteCard
                    title={note.title}
                    noteText={note.body}
                    noteId={note.id}
                  />
                  {/* </Paper> */}
                </Grid>
              );
            }
            return <div key={note.id}></div>;
          })}
      </Grid>
    </div>
  );
};

export default Home;
