import React, { useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { Box } from "@mui/material";

export default function YoutubePlayer(props) {
  const { submission } = props;
  const player = useRef(undefined);

  const onReady = (evt) => {
    player.current = evt.target;

    player.current.cueVideoById({
      videoId: submission.link.id,
    });
  };

  useEffect(() => {
    if (!submission || !player.current) return;

    player.current.cueVideoById({
      videoId: submission.link.id,
    });
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
