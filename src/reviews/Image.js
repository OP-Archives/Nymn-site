import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";

export default function Image(props) {
  const submission = props.submission.link;
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

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      {submission.isAlbum && (
        <>
          <Box
            sx={{
              backgroundColor: "black",
              aspectRatio: "16/9",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              component="img"
              sx={{
                objectFit: "contain",
                height: "100%",
                width: "100%",
              }}
              alt=""
              src={submission.imgurData.images.length > 0 ? submission.imgurData.images[imageIndex].link : ""}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pl: 1, pr: 1, pt: 1 }}>
            <Button variant="contained" onClick={prevImage}>{`<`}</Button>
            <Typography sx={{ p: 1 }}>
              {imageIndex + 1} of {submission.imgurData.images_count}
            </Typography>
            <Button variant="contained" onClick={nextImage}>{`>`}</Button>
          </Box>
        </>
      )}
      {!submission.isAlbum && (
        <Box
          sx={{
            backgroundColor: "black",
            aspectRatio: "16/9",
            height: "100%",
            width: "100%",
          }}
        >
          <Box
            component="img"
            sx={{
              objectFit: "contain",
              height: "100%",
              width: "100%",
            }}
            alt=""
            src={submission.imgurData?.link ?? submission.link}
          />
        </Box>
      )}
    </Box>
  );
}
