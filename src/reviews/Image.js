import { Box, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function Image(props) {
  const submission = props.submission.link;
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!submission) return;
    setImageIndex(0);
    return;
  }, [submission]);

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
      {submission.isAlbum && submission.imgurData && (
        <>
          <Box
            sx={{
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
              src={submission.imgurData.images.length > 0 && submission.imgurData.images[imageIndex] ? submission.imgurData.images[imageIndex].link : ""}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pl: 1, pr: 1, pt: 1 }}>
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
      {!submission.isAlbum && (
        <Box
          sx={{
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
