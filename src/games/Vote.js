import { Box, IconButton } from "@mui/material";
import client from "../client";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";

export default function Vote(props) {
  const { user, game, userVotes } = props;

  const removeVote = (userVote) => {
    const confirmDialog = window.confirm("Are you sure?");
    if (!confirmDialog) return;
    client
      .service("votes")
      .remove(userVote.id)
      .catch((e) => {
        console.error(e);
      });
  };

  const vote = () => {
    client
      .service("votes")
      .create({
        gameId: game.id,
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const userVote = userVotes?.find((vote) => vote.gameId === game.id);
  return (
    <Box sx={{ display: "flex", justifyContent: "end", alignItems: "center", flexDirection: "column", height: "100%", minHeight: 0 }}>
      {userVote && (
        <IconButton disabled={!user} color="error" onClick={() => removeVote(userVote)} variant="outlined">
          <ThumbDownOffAltIcon />
        </IconButton>
      )}

      {!userVote && (
        <IconButton disabled={!user} onClick={vote} variant="outlined" color="success">
          <ThumbUpOffAltIcon />
        </IconButton>
      )}
    </Box>
  );
}
