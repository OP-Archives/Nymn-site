import React, { useState } from "react";
import { Typography, Button, Box, TextField, Switch } from "@mui/material";
import logo from "../assets/logo.gif";
import { Alert } from "@mui/material";
import client from "../client";
import Loading from "../utils/Loading";

export default function Edit(props) {
  const { review, user } = props;
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const [title, setTitle] = useState(review.title);
  const [active, setActive] = useState(review.active);
  const [submission, setSubmission] = useState(review.submission);
  const [description, setDescription] = useState(review.description);

  const handleTitleChange = (evt) => {
    setTitle(evt.target.value);
  };

  const handleActiveChange = (_) => {
    setActive(!active);
  };

  const handleSubmissionChange = (_) => {
    setSubmission(!submission);
  };

  const handleDescriptonChange = (evt) => {
    setDescription(evt.target.value);
  };

  const handleEdit = (evt) => {
    if (evt) evt.preventDefault();
    return client
      .service("reviews")
      .patch(review.id, {
        title: title,
        active: active,
        submission: submission,
        description: description,
      })
      .then(() => {
        window.location.reload();
      })
      .catch((e) => {
        console.error(e);
        setError(true);
        setErrorMsg("Something went wrong..");
      });
  };

  const handleDelete = async (evt) => {
    if (evt) evt.preventDefault();
    const confirmDialog = window.confirm("Are you sure?");
    if (confirmDialog) {
      return client
        .service("reviews")
        .remove(review.id)
        .then(() => {
          window.location.reload();
        })
        .catch((e) => {
          console.error(e);
          setError(true);
          setErrorMsg("Something went wrong..");
        });
    }
  };

  if (user === undefined) return <Loading />;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <img alt="" src={logo} sx={{ height: "auto", width: "100%" }} />
      <Typography variant="h4" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }} color="primary">{`Edit`}</Typography>
      <Typography variant="h7" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }}>{`Review ID: ${review.id}`}</Typography>
      <Typography variant="h7" fontWeight={600} sx={{ textTransform: "uppercase" }}>{`${review.title}`}</Typography>
      {error && (
        <Alert sx={{ mt: 1 }} severity="error">
          {errorMsg}
        </Alert>
      )}
      <form noValidate style={{ marginTop: 1 }}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Title"
          name="title"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          autoFocus
          defaultValue={review.title}
          onChange={handleTitleChange}
        />
        <TextField
          multiline
          rows={4}
          variant="filled"
          margin="normal"
          fullWidth
          label="Description"
          name="Description"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          defaultValue={review.description}
          onChange={handleDescriptonChange}
        />
        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Switch checked={active} onChange={handleActiveChange} />
          <Typography variant="body1">Active</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Switch checked={submission} onChange={handleSubmissionChange} />
          <Typography variant="body1">Allow Submissions</Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            onClick={handleEdit}
            disabled={title === review.title && submission === review.submission && active === review.active && description === review.description}
          >
            Edit
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Button fullWidth type="submit" variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </form>
    </Box>
  );
}
