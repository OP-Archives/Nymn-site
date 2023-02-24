import { Box, Typography, Alert, TextField } from "@mui/material";
import { useState, useRef, useEffect, useCallback } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import Upload from "./fileUpload";
import { debounce } from "lodash";
import CustomButton from "../utils/CustomButton";

export default function Record(props) {
  const { password } = props;
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const onStop = (blobUrl, blob) => {
    setFile(new File([blob], name, { type: blob.type }));
  };
  const { status, startRecording, stopRecording, mediaBlobUrl, previewStream, error } = useReactMediaRecorder({ video: true, askPermissionOnMount: true, onStop: onStop });

  const handleNameChange = (evt) => {
    setName(evt.target.value + ".mp4");
  };

  const debouncedOverlayHandler = useCallback(debounce(handleNameChange, 300), []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ mt: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <Box>
        <TextField
          sx={{ m: 2 }}
          autoFocus
          variant="outlined"
          name="name"
          placeholder="Your Twitch Name"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          onChange={debouncedOverlayHandler}
          margin="dense"
        />
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      <Typography variant="body2">Status: {status}</Typography>
      {previewStream && previewStream.active && <VideoPreview stream={previewStream} />}
      {mediaBlobUrl && !previewStream.active && <video src={mediaBlobUrl} controls width="50%" />}
      <Box sx={{ display: "flex", mt: 1, justifyContent: "center" }}>
        <Box sx={{ m: 1 }}>
          <CustomButton disabled={name.length === 0 || status === "recording"} variant="contained" onClick={startRecording} color="nnys">
            Start Recording
          </CustomButton>
        </Box>
        <Box sx={{ m: 1 }}>
          <CustomButton disabled={name.length === 0 || status !== "recording"} variant="contained" onClick={stopRecording} color="nnys">
            Stop Recording
          </CustomButton>
        </Box>
      </Box>
      <Box sx={{ textAlign: "center", width: "50%" }}>
        <Upload file={file} password={password} />
      </Box>
    </Box>
  );
}

const VideoPreview = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);
  if (!stream) return null;

  return <video ref={videoRef} width="50%" autoPlay />;
};
