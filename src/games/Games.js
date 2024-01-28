import React, { useState, useEffect } from "react";
import { useMediaQuery, Box, Grid, Typography, Button, SvgIcon, Modal } from "@mui/material";
import SimpleBar from "simplebar-react";
import client from "../client";
import Footer from "../utils/Footer";
import Loading from "../utils/Loading";
import Game from "./Game";
import Search from "./Search";
import Submission from "./Submission";
import PublishIcon from "@mui/icons-material/Publish";
import FilterTags from "./FilterTags";
import InfiniteScroll from "react-infinite-scroll-component";

const OAUTH_LOGIN = `${process.env.REACT_APP_CONTESTS_API}/oauth/twitch?redirect=games`;

export default function Games(props) {
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [games, setGames] = useState(undefined);
  const [filteredGames, setFilteredGames] = useState(undefined);
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);
  const [userVotes, setUserVotes] = useState(undefined);
  const [submissionModal, setSubmissionModal] = useState(false);
  const [totalGames, setTotalGames] = useState(undefined);
  const { user, channel } = props;
  const limit = isMobile ? 50 : 25;

  useEffect(() => {
    document.title = `Games Suggestions - ${channel}`;

    if (user === undefined) return;

    const fetchGames = async () => {
      await client
        .service("games")
        .find({
          query: {
            $limit: limit,
          },
        })
        .then((res) => {
          setGames(res.data);
          setTotalGames(res.total);
        });
    };
    fetchGames();

    const fetchUserVotes = async () => {
      if (!user) return;
      await client
        .service("votes")
        .find()
        .then((res) => {
          setUserVotes(res);
        });
    };
    fetchUserVotes();

    client.service("games").on("removed", (game) => {
      setGames((games) => games.filter((a) => a.id !== game.id));
    });

    client.service("games").on("patched", (patchedGame) => {
      setGames((games) => {
        return games.map((game) => {
          if (game.id === patchedGame.id) {
            return {
              ...game,
              ...patchedGame,
            };
          }
          return game;
        });
      });
    });

    client.service("votes").on("created", (vote) => {
      setGames((games) => {
        return games.map((game) => {
          if (game.id === vote.gameId) {
            return {
              ...game,
              votes_total: game.votes_total + 1,
            };
          }
          return game;
        });
      });
      if (vote.userId.toString() === user?.id) {
        setUserVotes((userVotes) => [...userVotes, vote]);
      }
    });

    client.service("votes").on("removed", (vote) => {
      setGames((games) => {
        return games.map((game) => {
          if (game.id === vote.gameId) {
            return {
              ...game,
              votes_total: game.votes_total - 1,
            };
          }
          return game;
        });
      });
      if (vote.userId.toString() === user?.id) {
        setUserVotes((userVotes) => userVotes.filter((a) => a.id !== vote.id));
      }
    });
    return;
  }, [channel, user, limit]);

  useEffect(() => {
    if (!games) return;
    if (tags.length === 0) return setFilteredGames(games);

    setFilteredGames(
      games.filter((game) => {
        const gameTags = game.tags;
        return tags.every((tag) => gameTags.some((gameTag) => gameTag.description === tag.name));
      })
    );
    return;
  }, [tags, setGames, games]);

  const login = () => {
    window.location.href = OAUTH_LOGIN;
  };

  const fetchNextGames = async () => {
    await client
      .service("games")
      .find({
        query: {
          $skip: page * limit,
          $limit: limit,
        },
      })
      .then((res) => {
        setGames((games) => [...games, ...res.data]);
        setTotalGames(res.total);
        setPage((page) => page + 1);
      });
  };

  if (user === undefined || games === undefined || totalGames === undefined) return <Loading />;
  const hasMore = totalGames / games.length > 1;

  return (
    <SimpleBar scrollableNodeProps={{ id: "scroll-node" }} style={{ minHeight: 0, height: "100%" }}>
      <InfiniteScroll style={{ overflow: "hidden", height: "100%" }} dataLength={games.length} scrollableTarget={"scroll-node"} next={fetchNextGames} hasMore={hasMore} loader={<Loading />}>
        <Box sx={{ padding: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", width: "100%" }}>
              <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <Typography variant="h3" fontWeight={600} color="primary">
                  Game Suggestions
                </Typography>
              </Box>
              {!user && (
                <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={login}
                    startIcon={
                      <SvgIcon>
                        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                      </SvgIcon>
                    }
                  >
                    Connect
                  </Button>
                </Box>
              )}
              <Box sx={{ mt: 1, display: "flex", alignItems: "center", width: "100%" }}>
                <FilterTags setTags={setTags} />
                <Search setGames={setGames} />

                <Box sx={{ flex: 1, display: "flex", justifyContent: "end" }}>
                  <Button variant="contained" disabled={!user} onClick={() => setSubmissionModal(true)} startIcon={<PublishIcon />} color="primary">
                    Submit
                  </Button>
                </Box>

                <Modal open={submissionModal} onClose={() => setSubmissionModal(false)}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      maxWidth: 650,
                      bgcolor: "background.paper",
                      border: "2px solid #000",
                      boxShadow: 24,
                      p: 4,
                    }}
                  >
                    <Submission user={user} />
                  </Box>
                </Modal>
              </Box>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {filteredGames &&
              filteredGames.sort((a, b) => b.votes_total - a.votes_total).map((game, _) => <Game key={game.id} gridSize={2} game={game} isMobile={isMobile} user={user} userVotes={userVotes} />)}
          </Grid>
        </Box>
        <Footer />
      </InfiniteScroll>
    </SimpleBar>
  );
}
