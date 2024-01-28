import React, { useEffect, useState } from "react";
import { Typography, Button, Box, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import logo from "../assets/logo.gif";
import { Alert } from "@mui/material";
import client from "../client";
import Loading from "../utils/Loading";

const IMGUR_CLIENT_ID = process.env.REACT_APP_IMGUR_CLIENT_ID;
const IMGUR_BASE_API = "https://api.imgur.com/3";

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

    const buildVideo = async () => {
      let regexToUse;
      switch (contest.type) {
        case "alert":
          regexToUse =
            source === 1
              ? //eslint-disable-next-line
                /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/|shorts\/|clip\/)?)([\w\-]+)(\S+)?$/
              : source === 2
              ? /https:\/\/(?:clips|www)\.twitch\.tv\/(?:(?:[a-z]+)\/clip\/)?([^?#]+).*$/
              : source === 3
              ? /https:\/\/(?:www\.)?streamable\.com\/([a-zA-Z0-9]*)$/
              : null;
          break;
        case "emote":
          regexToUse =
            source === 1
              ? //eslint-disable-next-line
                /https:\/\/(?:www\.)?7tv\.app\/(?:emotes|emote)?\/([a-zA-Z0-9]*)$/
              : source === 2 //eslint-disable-next-line
              ? /https:\/\/(?:i\.)?imgur\.com\/(?:a\/|gallery\/)?([^.]+)(?:\..*)?$/
              : null;
          break;
        default:
          regexToUse = null;
          break;
      }

      if (!regexToUse.test(link)) {
        setLinkError(true);
        setLinkErrorMsg("Link is not valid!");
        setVideo(null);
        return;
      }

      let newLink = link.valueOf();
      const linkSplit = newLink.split(regexToUse);

      let video;
      switch (contest.type) {
        case "alert":
          video = {
            id: source === 1 ? linkSplit[5] : source === 2 ? linkSplit[1] : source === 3 ? linkSplit[1] : null,
            link: link,
            source: source === 1 ? "youtube" : source === 2 ? "twitch" : source === 3 ? "streamable" : null,
          };
          setVideo(video);
          break;
        case "emote":
          video = {
            id: source === 1 || source === 2 ? linkSplit[1] : null,
            link: link,
            source: source === 1 ? "7tv" : source === 2 ? "imgur" : null,
            isAlbum: source === 2 ? link.includes("/a/") : false,
            isGallery: source === 2 ? link.includes("/gallery/") : false,
          };

          if (source === 2) {
            const imgurData = video.isAlbum ? await getAlbum(video.id) : await getImageInfo(video.id);
            video.imgurData = imgurData;
          }
          setVideo(video);
          break;
        default:
          break;
      }
    };

    const getImageInfo = async (id) => {
      const data = await fetch(`${IMGUR_BASE_API}/image/${id}?client_id=${IMGUR_CLIENT_ID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.data.error) return null;
          return response.data;
        })
        .catch((e) => {
          console.error(e);
          return null;
        });
      return data;
    };

    const getAlbum = async (id) => {
      const data = await fetch(`${IMGUR_BASE_API}/album/${id}?client_id=${IMGUR_CLIENT_ID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.data.error) return null;
          return response.data;
        })
        .catch((e) => {
          console.error(e);
          return null;
        });
      return data;
    };
    buildVideo();
    return;
  }, [link, contest, source]);

  const handleSubmit = (evt) => {
    if (evt) evt.preventDefault();

    return client
      .service("submissions")
      .create({
        contestId: contest.id,
        userId: user.id,
        username: user.username,
        display_name: user.display_name,
        video: video,
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
        contestId: contest.id,
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
        {(contest.type === "alert" || contest.type === "emote") && (
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
        {contest.type === "emote" && (
          <FormControl fullWidth required sx={{ mt: 1 }}>
            <InputLabel id="source-label">Source</InputLabel>
            <Select labelId="source-label" value={source} label="Source" onChange={handleSource}>
              <MenuItem value={1}>7TV</MenuItem>
              <MenuItem value={2}>Imgur</MenuItem>
            </Select>
          </FormControl>
        )}
        <TextField variant="outlined" margin="normal" required fullWidth label={"Link"} name={"Link"} autoComplete="off" autoCapitalize="off" autoCorrect="off" onChange={handleLinkChange} />
        {commentError && (
          <Alert sx={{ mt: 1 }} severity="error">
            {commentErrorMsg}
          </Alert>
        )}
        {(contest.type === "alert" || contest.type === "emote") && (
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
