import { Box, Typography, IconButton } from "@mui/material";
import { useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function Image(props) {
  const submission = props.submission.video;
  const [imageIndex, setImageIndex] = useState(0);

  const nextImage = (_) => {
    const index = imageIndex + 1;
    if (!submission.imgurData.images[index]) return;
    setImageIndex(index);
  };

  const prevImage = (_) => {
    const index = imageIndex - 1;
    if (!submission.imgurData.images[index]) return;
    setImageIndex(index);
  };

  if (!submission.imgurData) return;

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {submission.isAlbum && (
        <>
          <Box component="img" alt="" src={submission.imgurData.images[imageIndex].link} />
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pl: 1, pr: 1, pt: 3 }}>
            <IconButton variant="outlined" onClick={prevImage}>
              <KeyboardArrowLeftIcon color="primary" fontSize="large" />
            </IconButton>
            <Typography sx={{ p: 1 }}>
              {imageIndex + 1} of {submission.imgurData.images_count}
            </Typography>
            <IconButton variant="outlined" onClick={nextImage}>
              <KeyboardArrowRightIcon color="primary" fontSize="large" />
            </IconButton>
          </Box>
        </>
      )}
      {!submission.isAlbum && <Box component="img" alt="" src={submission.imgurData?.link ?? submission.link} />}
    </Box>
  );
}
