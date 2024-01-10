import React, { useEffect, useState } from "react";
import { Typography, Button, Box, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import logo from "../assets/logo.gif";
import { Alert } from "@mui/material";
import client from "../client";
import Loading from "../utils/Loading";

export default function Creation(props) {
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(undefined);
  const [linkError, setLinkError] = useState(false);
  const [linkErrorMsg, setLinkErrorMsg] = useState(undefined);
  const [commentError, setCommentError] = useState(false);
  const [commentErrorMsg, setCommentErrorMsg] = useState(undefined);
  const [source, setSource] = useState(1);
  const [link, setLink] = useState("");
  const [fileType, setFileType] = useState(1);
  const { type, submission, review, user } = props;

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
    let regexToUse;

    //image
    if (fileType === 1) {
      switch (source) {
        case 1:
          regexToUse = /https:\/\/(?:i\.)?imgur\.com\/(.*)(?:\..*)$/;
          break;
        default:
          regexToUse = null;
          break;
      }
    }
    //video
    else if (fileType === 2) {
      switch (source) {
        case 1:
          //eslint-disable-next-line
          regexToUse = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/|shorts\/|clip\/)?)([\w\-]+)(\S+)?$/;
          break;
        case 2:
          regexToUse = /https:\/\/(?:www\.)?streamable\.com\/([a-zA-Z0-9]*)$/;
          break;
        default:
          regexToUse = null;
          break;
      }
    }

    if (!regexToUse.test(link)) {
      setLinkError(true);
      setLinkErrorMsg("Link is not valid!");
      setFile(null);
      return;
    }

    let newLink = link.valueOf();
    const linkSplit = newLink.split(regexToUse);

    if (fileType === 1) {
      setFile({
        id: source === 1 ? linkSplit[1] : null,
        link: link,
        source: source === 1 ? "imgur" : null,
      });
    } else if (fileType === 2) {
      setFile({
        id: source === 1 ? linkSplit[5] : source === 2 ? linkSplit[1] : null,
        link: link,
        source: source === 1 ? "youtube" : source === 2 ? "streamable" : null,
      });
    }
  }, [link, review, source, fileType]);

  const handleSubmit = (evt) => {
    if (evt) evt.preventDefault();
    let tmpFile = {
      id: file.id,
      link: file.link,
      source: file.source,
    };
    return client
      .service("review_submissions")
      .create({
        reviewId: review.id,
        userId: user.id,
        username: user.username,
        display_name: user.display_name,
        link: tmpFile,
        comment: comment,
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
    let tmpFile = {
      id: file.id,
      link: file.link,
      source: file.source,
    };
    return client
      .service("submissions")
      .patch(submission.id, {
        reviewId: review.id,
        link: tmpFile,
        comment: comment,
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

  if (user === undefined) return <Loading />;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <img alt="" src={logo} sx={{ height: "auto", width: "100%" }} />
      {submission && <Typography variant="h7" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }}>{`Submission ID: ${submission.id}`}</Typography>}
      <Typography variant="h7" fontWeight={600} sx={{ textTransform: "uppercase" }}>{`Review ID: ${review.id}`}</Typography>
      <Typography variant="h7" fontWeight={600} sx={{ textTransform: "uppercase" }}>{`${review.title}`}</Typography>
      <Typography variant="h5" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }} color="primary">
        {type === "Modify" ? "Modify Submission" : "Submission"}
      </Typography>
      {error && (
        <Alert sx={{ mt: 1 }} severity="error">
          {errorMsg}
        </Alert>
      )}
      <form noValidate>
        {linkError && (
          <Alert sx={{ mt: 1 }} severity="error">
            {linkErrorMsg}
          </Alert>
        )}
        <FormControl fullWidth required sx={{ mt: 1 }}>
          <InputLabel id="file-label">File Type</InputLabel>
          <Select labelId="file-label" value={fileType} label="File Type" onChange={(evt) => setFileType(evt.target.value)}>
            <MenuItem value={1}>Image</MenuItem>
            <MenuItem value={2}>Video</MenuItem>
          </Select>
        </FormControl>
        {fileType === 1 && (
          <FormControl fullWidth required sx={{ mt: 1 }}>
            <InputLabel id="source-label">Source</InputLabel>
            <Select labelId="source-label" value={source} label="Source" onChange={(evt) => setSource(evt.target.value)}>
              <MenuItem value={1}>Imgur</MenuItem>
            </Select>
          </FormControl>
        )}
        {fileType === 2 && (
          <FormControl fullWidth required sx={{ mt: 1 }}>
            <InputLabel id="source-label">Source</InputLabel>
            <Select labelId="source-label" value={source} label="Source" onChange={(evt) => setSource(evt.target.value)}>
              <MenuItem value={1}>Youtube</MenuItem>
              <MenuItem value={2}>Streamable</MenuItem>
            </Select>
          </FormControl>
        )}
        <TextField variant="outlined" margin="normal" required fullWidth label={"Link"} name={"Link"} autoComplete="off" autoCapitalize="off" autoCorrect="off" onChange={handleLinkChange} />
        {commentError && (
          <Alert sx={{ mt: 1 }} severity="error">
            {commentErrorMsg}
          </Alert>
        )}
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
        {type === "Modify" ? (
          <Button sx={{ mt: 1 }} type="submit" fullWidth variant="contained" color="primary" onClick={handleModify} disabled={!file}>
            Modify
          </Button>
        ) : (
          <Button sx={{ mt: 1 }} type="submit" fullWidth variant="contained" color="primary" onClick={handleSubmit} disabled={!file}>
            Submit
          </Button>
        )}
      </form>
    </Box>
  );
}
