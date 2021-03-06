import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { FETCH_NOTES_QUERY } from "../../utils/graphql";
import { useForm } from "../../utils/hooks";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 250,
    maxWidth: 400,
    // padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  title: {
    fontSize: 14,
  },
  content: { padding: 15 },
  // pos: {
  //   marginBottom: 12,
  // },
  closeButton: {
    position: "absolute",
  },
  icon: { marginRight: "auto", paddingTop: 10 },
}));

export default function NoteCard({ title, noteText, noteId }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { values, onChange, onSubmit } = useForm(updateNoteCallback, {
    noteId: noteId,
    title: title,
    body: noteText,
  });

  const stopPropagation = (e) => {
    e.stopPropagation();
    deleteNote();
  };

  const [deleteNote] = useMutation(DELETE_NOTE_MUTATION, {
    update(proxy) {
      const data = proxy.readQuery({
        query: FETCH_NOTES_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_NOTES_QUERY,
        data: { getNotes: data.getNotes.filter((note) => note.id !== noteId) },
      });
    },
    variables: {
      noteId,
    },
  });

  const [updateNote] = useMutation(UPDATE_NOTE_MUTATION, {
    variables: {
      noteId: values.noteId,
      title: values.title,
      body: values.body,
    },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_NOTES_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_NOTES_QUERY,
        data: {
          getNotes: [
            result.data.updateNote,
            ...data.getNotes.filter((note) => note.id !== noteId),
          ],
        },
      });
    },
    onError(err) {
      return err;
    },
  });

  function updateNoteCallback() {
    updateNote();
    handleClose();
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Card
        className={classes.root}
        variant="outlined"
        onClick={handleClickOpen}
      >
        <CardContent className={classes.content}>
          <Typography variant={"h5"} component="h2" gutterBottom>
            <b>{title}</b>
          </Typography>
          <Typography>{noteText}</Typography>
          <DeleteIcon className={classes.icon} onClick={stopPropagation} />
        </CardContent>
      </Card>

      <Dialog
        open={open}
        fullWidth={true}
        maxWidth={"sm"}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <TextField
            // autoFocus
            margin="dense"
            id="name"
            label="Title"
            type="text"
            name="title"
            value={values.title}
            onChange={onChange}
            fullWidth
          />
        </DialogTitle>
        <DialogContent>
          <TextField
            id="outlined-multiline-static"
            label="Multiline"
            multiline
            rows={4}
            cols={7}
            name="body"
            onChange={onChange}
            value={values.body}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <DeleteIcon onClick={stopPropagation} />
          <Button autoFocus onClick={onSubmit} color="primary">
            update
          </Button>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DELETE_NOTE_MUTATION = gql`
  mutation deleteNote($noteId: ID!) {
    deleteNote(noteId: $noteId)
  }
`;
const UPDATE_NOTE_MUTATION = gql`
  mutation updateNote($noteId: ID!, $title: String!, $body: String!) {
    updateNote(noteId: $noteId, title: $title, body: $body) {
      id
      title
      body
      __typename
    }
  }
`;
