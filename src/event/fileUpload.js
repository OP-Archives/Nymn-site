import { useState } from "react";
import axios from "axios";
import { Alert, Box, LinearProgress, Typography } from "@mui/material";
import CustomButton from "../utils/CustomButton";
import client from "./client";

const MAX_FILE_SIZE = 50000000;

export default function Upload(props) {
  const { file } = props;
  const [progress, setProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (evt) => {
    setUploadError(false);
    setProgress(null);
    if (file.type.split("/")[0] !== "video" || file.size > MAX_FILE_SIZE) return;

    setUploading(true);

    const formData = new FormData();

    formData.append("video", file);

    const { accessToken } = await client.get("authentication");
    await axios({
      method: "post",
      url: "https://api.nymn.gg/upload",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: formData,
      onUploadProgress: (p) => {
        setProgress((p.loaded / p.total) * 100);
      },
    })
      .then((data) => {
        if (data.error) return setUploadError(data.msg);
      })
      .catch((error) => {
        setUploadError(`Server encountered an error!`);
        console.error(error);
      });

    setUploading(false);
  };

  return (
    <>
      {file && (
        <>
          <Box sx={{ m: 1 }}>
            <CustomButton disabled={!file || uploading} onClick={upload} variant="contained" component="label" color="nnys" sx={{ mt: 1 }}>
              Submit Video
            </CustomButton>
          </Box>
          <Box sx={{ m: 1 }}>{uploadError && <Alert severity="error">{uploadError}</Alert>}</Box>
          <Box sx={{ m: 1 }}>{progress && <LinearProgressWithLabel value={progress} />}</Box>
          <Box sx={{ m: 1 }}>{progress >= 100 && <Alert severity="success">Upload completed! You may exit now.</Alert>}</Box>
        </>
      )}
    </>
  );
}

const LinearProgressWithLabel = (props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
};
