import React, { useState, useEffect, useRef } from "react";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

import { useMutation } from "@apollo/react-hooks";
import { useForm } from "../../utils/hooks";
import { FETCH_NOTES_QUERY } from "../../utils/graphql";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",

    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  paper_size: {
    minWidth: 550,
    marginTop: theme.spacing(1),
  },
  "& .MuiTextField-root": {
    // margin: theme.spacing(1),
    // width: "50ch",
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
  },
}));

export default function NoteInputCard() {
  const { values, onChange, onSubmit } = useForm(createNoteCallback, {
    title: "",
    body: "",
  });
  const [expanded, setExpanded] = useState(false); //expansion state of the card
  const ref = useRef(null); // reference to tag to expand and compress
  const classes = useStyles();

  const [createNote, { error }] = useMutation(CREATE_NOTE_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_NOTES_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_NOTES_QUERY,
        data: { getNotes: [result.data.createNote, ...data.getNotes] },
      });
      values.body = "";
      values.title = "";
    },
    onError(err) {
      return err;
    },
  });

  function createNoteCallback() {
    createNote();
  } //save the card data

  useEffect(() => {
    document.addEventListener("click", compressCard, true);
    return () => {
      document.removeEventListener("click", compressCard, true);
    };
  }); //adding listner on mount for clicks

  const compressCard = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      if (expanded === true) {
        setExpanded(false);
      }
    }
  }; //compress Input card on outside click

  const expandCard = () => {
    setExpanded(true);
  }; // Express input card on click

  const oncomp = (event) => {
    event.target.setAttribute("autocomplete", "off");
  };

  return (
    // <Card className={classes.root}>
    <Paper elevation={0} className={classes.paper_size}>
      {/* <CardActions> */}
      <div>
        <div
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={expandCard}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <TextField
            id="Title"
            label="Title"
            variant="outlined"
            margin="normal"
            name="title"
            value={values.title}
            error={error ? true : false}
            onChange={onChange}
            onFocus={oncomp}
            autoFocus
            fullWidth
          />
        </div>
        <div className="note_text" ref={ref}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <div>
              <TextField
                multiline
                rows={4}
                variant="outlined"
                label="input note here"
                name="body"
                value={values.body}
                error={error ? true : false}
                onChange={onChange}
                fullWidth
              />
            </div>
            <div>
              <Button onClick={onSubmit}>Add</Button>
            </div>
          </Collapse>
        </div>
      </div>
      {/* </Card> */}
    </Paper>
  );
}

const CREATE_NOTE_MUTATION = gql`
  mutation createNote($title: String!, $body: String!) {
    createNote(title: $title, body: $body) {
      id
      title
      body
      createdAt
      username
    }
  }
`;
