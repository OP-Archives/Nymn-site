import { Box } from "@mui/material";

export default function Image(props) {
  const { submission } = props;

  return (
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
        src={submission.link.link}
      />
    </Box>
  );
}
