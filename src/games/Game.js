import React from "react";
import { Box, Typography, Link, Grid, Paper, Chip, IconButton, Collapse, styled } from "@mui/material";
import CustomLink from "../utils/CustomLink";
import Vote from "./Vote";
import VoteImg from "../assets/nymnOkay.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Admin from "./Admin";

const BASE_STEAM_LINK = "https://store.steampowered.com/app";

export default function Game(props) {
  const { game, gridSize, user, userVotes } = props;
  const steamLink = `${BASE_STEAM_LINK}/${game.id}`;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid item xs={gridSize} sx={{ maxWidth: "24rem", flexBasis: "24rem" }}>
      <Paper elevation={1} sx={{ p: 1, minHeight: "350px", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            overflow: "hidden",
            width: "100%",
            height: 151,
            position: "relative",
            "&:hover": {
              boxShadow: "0 0 8px #fff",
            },
            mb: 0.5,
          }}
        >
          <Link href={steamLink} target="_blank" rel="noopener noreferrer">
            <img className="thumbnail" alt="" src={game.image} />
          </Link>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", flex: 1, flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, flexDirection: "column" }}>
            <span>
              <CustomLink href={steamLink} target="_blank" rel="noopener noreferrer" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", color: "white" }}>
                <Typography variant="h6" sx={{ fontWeight: "550" }}>
                  {game.name}
                </Typography>
              </CustomLink>
            </span>
            <Box sx={{ justifyContent: "center", display: "flex", alignItems: "center", mb: 0.5, flexWrap: "wrap" }}>
              {game.tags && game.tags.map((tag, _) => <Chip key={tag.id} size="small" color="info" variant="outlined" label={tag.description} sx={{ mr: 0.3 }} />)}
            </Box>
            <Box sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: "550" }}>
                Release Date: {game.release_date.coming_soon ? "Coming Soon" : game.release_date.date}
              </Typography>
            </Box>
            <Box sx={{ justifyContent: "center", display: "flex", alignItems: "center" }}>
              <Typography variant="caption" sx={{ fontWeight: "550" }}>
                {game.is_free && "Free To Play"}
                {!game.is_free && !game.price && "Price TBD"}
                {!game.is_free && game.price && game.price.final_formatted}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="caption" color="white" sx={{ fontWeight: "550", mr: 0.3 }}>
                {`Submitted by: `}
              </Typography>
              <Typography variant="caption" color="primary" sx={{ fontWeight: "550" }}>
                {`${game.user.display_name}`}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {game.hidden && <Chip size="small" color="warning" variant="outlined" label="Hidden" sx={{ mr: 0.3 }} />}
              {game.played && <Chip size="small" color="success" variant="outlined" label="Played" sx={{ mr: 0.3 }} />}
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "end", flex: 1, flexDirection: "column", alignItems: "center", width: "100%" }}>
            <Box sx={{ display: "flex", width: "100%" }}>
              <Box sx={{ flex: 1, display: "flex", alignItems: "end" }}>
                <Box sx={{ mr: 0.3 }}>
                  <img alt="ok" src={VoteImg} height={45} />
                </Box>
                <Typography variant="h6" color="primary" sx={{ fontWeight: "550" }}>
                  {`${game.votes_total}`}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Vote game={game} user={user} userVotes={userVotes} />
              </Box>

              <Box sx={{ flex: 1, display: "flex", justifyContent: "end" }}>
                <Box sx={{ display: "flex" }}>
                  <Admin user={user} game={game} />
                  <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                    <ExpandMoreIcon />
                  </ExpandMore>
                </Box>
              </Box>
            </Box>

            <Collapse in={expanded} timeout="auto">
              <Typography sx={{ mt: 1 }} paragraph>{`${game.description.replaceAll("&quot;", '"')}`}</Typography>
            </Collapse>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
