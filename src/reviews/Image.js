import { Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";

const IMGUR_CLIENT_ID = process.env.REACT_APP_IMGUR_CLIENT_ID;
const IMGUR_BASE_API = "https://api.imgur.com/3";

export default function Image(props) {
  const submission = props.submission.link;
  const [imageIndex, setImageIndex] = useState(0);
  const [imgurData, setImgurData] = useState(submission.imgurData);

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

  useEffect(() => {
    //fallback for old images without imgur data
    if (imgurData) return;

    const getImageInfo = async () => {
      const data = await fetch(`${IMGUR_BASE_API}/image/${submission.id}?client_id=${IMGUR_CLIENT_ID}`, {
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
      setImgurData(data);
    };
    getImageInfo();
    return;
  }, [imgurData, submission]);

  console.log(imgurData);

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
              src={imgurData.images[imageIndex].link}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", pl: 1, pr: 1, pt: 1 }}>
            <Button variant="contained" onClick={prevImage}>{`<`}</Button>
            <Typography sx={{ p: 1 }}>
              {imageIndex + 1} of {imgurData.images_count}
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
            src={imgurData?.link}
          />
        </Box>
      )}
    </Box>
  );
}
