import { Box, Typography, Alert } from "@mui/material";
import { useState } from "react";
import Upload from "./utils/upload";
import CustomButton from "./utils/CustomButton";

const MAX_FILE_SIZE = 200000000;

export default function UploadComponent(props) {
  const { password } = props;
  const [fileError, setFileError] = useState(null);
  const [file, setFile] = useState(null);

  const changeFile = (evt) => {
    setFileError(false);
    const tmpFile = evt.target.files[0];
    if (tmpFile.type.split("/")[0] !== "video") {
      setFile(null);
      return setFileError("It has to be a valid video file!");
    }

    if (tmpFile.size > MAX_FILE_SIZE) {
      setFile(null);
      return setFileError(`File size is too big! Limit: 200 Mbs`);
    }
    setFile(evt.target.files[0]);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", mb: 2 }}>
      {fileError && <Alert severity="error">{fileError}</Alert>}
      <CustomButton variant="contained" component="label" color="nnys" sx={{ mt: 1 }}>
        Choose a Video
        <input onChange={changeFile} type="file" accept="video/*,.mkv" hidden title="" value="" />
      </CustomButton>
      <Typography variant="caption" color="textSecondary">
        Limit: 200 Mbs
      </Typography>
      {file && (
        <Box sx={{textAlign: "center"}}>
          <video src={URL.createObjectURL(file)} width="100%" height={300} controls />
          <Box sx={{ m: 1 }}>
            <Typography variant="body2">{file.name}</Typography>
          </Box>
          <Box sx={{ m: 1 }}>
            <Typography variant="body2">File Size: {(file.size / 1000 / 1000).toFixed(2)} Mbs</Typography>
          </Box>
          <Upload file={file} password={password} />
        </Box>
      )}
    </Box>
  );
}
