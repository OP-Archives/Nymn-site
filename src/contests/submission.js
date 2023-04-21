import React, { useEffect, useState } from "react";
import { Typography, Button, Box, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import logo from "../assets/logo.gif";
import { Alert } from "@mui/material";
import client from "./client";
import Loading from "../utils/Loading";

export default function Creation(props) {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [video, setVideo] = useState(undefined);
  const [linkError, setLinkError] = useState(false);
  const [linkErrorMsg, setLinkErrorMsg] = useState(undefined);
  const [commentError, setCommentError] = useState(false);
  const [commentErrorMsg, setCommentErrorMsg] = useState(undefined);
  const [source, setSource] = useState(1);
  const [link, setLink] = useState("");
  const { type, submission, contest, user } = props;

  const handleTitleChange = (evt) => {
    setTitle(evt.target.value);
  };

  const handleCommentChange = (evt) => {
    setCommentError(false);
    if (evt.target.value.length >= 280) {
      setCommentError(true);
      setCommentErrorMsg("Comment is too long..");
      setComment("");
      return;
    }
    setComment(evt.target.value);
  };

  const handleLinkChange = (evt) => {
    setLink(evt.target.value);
  };

  useEffect(() => {
    if (link.length === 0) return;
    setLinkError(false);
    const regex =
      contest.type === "alert" && source === 1
        ? //eslint-disable-next-line
          /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/|shorts\/|clip\/)?)([\w\-]+)(\S+)?$/
        : contest.type === "alert" && source === 2
        ? /https:\/\/(?:clips|www)\.twitch\.tv\/(?:(?:[a-z]+)\/clip\/)?([^?#]+).*$/
        : contest.type === "alert" && source === 3
        ? /https:\/\/(?:www\.)?streamable\.com\/([a-zA-Z0-9]*)$/
        : null;

    if (!regex.test(link)) {
      setLinkError(true);
      setLinkErrorMsg("Link is not valid!");
      setVideo(null);
      return;
    }

    let newLink = link.valueOf();
    const linkSplit = newLink.split(regex);
    setVideo({
      id: contest.type === "alert" && source === 1 ? linkSplit[5] : contest.type === "alert" && source === 2 ? linkSplit[1] : contest.type === "alert" && source === 3 ? linkSplit[1] : null,
      link: link,
      source: contest.type === "alert" && source === 1 ? "youtube" : contest.type === "alert" && source === 2 ? "twitch" : contest.type === "alert" && source === 3 ? "streamable" : null,
    });
  }, [link, contest, source]);

  const handleSubmit = (evt) => {
    if (evt) evt.preventDefault();
    let tmpVideo = {
      id: video.id,
      link: video.link,
      source: video.source,
    };
    return client
      .service("submissions")
      .create({
        contestId: contest.id,
        userId: user.id,
        username: user.username,
        display_name: user.display_name,
        video: tmpVideo,
        comment: comment,
        title: title,
      })
      .then(() => {
        window.location.reload();
      })
      .catch((e) => {
        console.error(e);
        setError(true);
        setErrorMsg(e.message);
      });
  };

  const handleModify = (evt) => {
    if (evt) evt.preventDefault();
    if (!submission) return;
    let tmpVideo = {
      id: video.id,
      link: video.link,
      source: video.source,
    };
    return client
      .service("submissions")
      .patch(submission.id, {
        video: tmpVideo,
        comment: comment,
        title: title,
      })
      .then(() => {
        window.location.reload();
      })
      .catch((e) => {
        console.error(e);
        setError(true);
        setErrorMsg(e.message);
      });
  };

  const handleSource = (event) => {
    setSource(event.target.value);
  };

  if (user === undefined) return <Loading />;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <img alt="" src={logo} sx={{ height: "auto", width: "100%" }} />
      {submission && <Typography variant="h7" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }}>{`Submission ID: ${submission.id}`}</Typography>}
      <Typography variant="h7" fontWeight={600} sx={{ textTransform: "uppercase" }}>{`Contest ID: ${contest.id}`}</Typography>
      <Typography variant="h7" fontWeight={600} sx={{ textTransform: "uppercase" }}>{`${contest.title}`}</Typography>
      <Typography variant="h5" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }} color="primary">
        {type === "Modify" ? "Modify Submission" : "Submission"}
      </Typography>
      {error && (
        <Alert sx={{ mt: 1 }} severity="error">
          {errorMsg}
        </Alert>
      )}
      <form noValidate>
        {(contest.type === "song" || contest.type === "alert" || contest.type === "clips") && (
          <TextField
            sx={{ mt: 1 }}
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
            onChange={handleTitleChange}
          />
        )}
        {linkError && (
          <Alert sx={{ mt: 1 }} severity="error">
            {linkErrorMsg}
          </Alert>
        )}
        {contest.type === "alert" && (
          <FormControl fullWidth required sx={{ mt: 1 }}>
            <InputLabel id="source-label">Source</InputLabel>
            <Select labelId="source-label" value={source} label="Source" onChange={handleSource}>
              <MenuItem value={1}>Youtube</MenuItem>
              <MenuItem value={2}>Twitch</MenuItem>
              <MenuItem value={3}>Streamable</MenuItem>
            </Select>
          </FormControl>
        )}
        <TextField variant="outlined" margin="normal" required fullWidth label={"Link"} name={"Link"} autoComplete="off" autoCapitalize="off" autoCorrect="off" onChange={handleLinkChange} />
        {commentError && (
          <Alert sx={{ mt: 1 }} severity="error">
            {commentErrorMsg}
          </Alert>
        )}
        {contest.type === "alert" && (
          <TextField
            multiline
            rows={4}
            variant="filled"
            margin="normal"
            fullWidth
            label="Comment"
            name="Comment"
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            onChange={handleCommentChange}
          />
        )}
        {type === "Modify" ? (
          <Button sx={{ mt: 1 }} type="submit" fullWidth variant="contained" color="primary" onClick={handleModify} disabled={contest.type !== "review" ? title.length === 0 || !video : !video}>
            Modify
          </Button>
        ) : (
          <Button sx={{ mt: 1 }} type="submit" fullWidth variant="contained" color="primary" onClick={handleSubmit} disabled={contest.type !== "review" ? title.length === 0 || !video : !video}>
            Submit
          </Button>
        )}
      </form>
    </Box>
  );
}
