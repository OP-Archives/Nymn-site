import React, { useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Box } from "@mui/material";

export default function YoutubePlayer(props) {
  const { submission } = props;
  const player = useRef(undefined);

  const onReady = (evt) => {
    player.current = evt.target;

    player.current.cueVideoById(
      submission.video.end != null
        ? {
            videoId: submission.video.id,
            startSeconds: submission.video.start != null ? submission.video.start : 0,
            endSeconds: submission.video.end,
          }
        : {
            videoId: submission.video.id,
            startSeconds: submission.video.start != null ? submission.video.start : 0,
          }
    );
  };

  useEffect(() => {
    if (!submission || !player.current) return;

    player.current.cueVideoById(
      submission.video.end
        ? {
            videoId: submission.video.id,
            startSeconds: submission.video.start ? submission.video.start : 0,
            endSeconds: submission.video.end,
          }
        : {
            videoId: submission.video.id,
            startSeconds: submission.video.start ? submission.video.start : 0,
          }
    );
  }, [submission]);

  return (
    <Box
      sx={{
        backgroundColor: "black",
        aspectRatio: "16/9",
        height: "100%",
        width: "100%",
      }}
    >
      <YouTube
        id="player"
        className={`youtube-player`}
        opts={{
          height: "100%",
          width: "100%",
          playerVars: {
            autoplay: 0,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
          },
        }}
        onReady={onReady}
      />
    </Box>
  );
}
