import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

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
            <Button variant="contained" onClick={prevImage}>{`<`}</Button>
            <Typography sx={{ p: 1 }}>
              {imageIndex + 1} of {submission.imgurData.images_count}
            </Typography>
            <Button variant="contained" onClick={nextImage}>{`>`}</Button>
          </Box>
        </>
      )}
      {!submission.isAlbum && <Box component="img" alt="" src={submission.imgurData?.link ?? submission.link} />}
    </Box>
  );
}
