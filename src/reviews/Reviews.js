import React, { useState, useEffect } from "react";
import { useMediaQuery, Box, Typography, Button, SvgIcon, Paper } from "@mui/material";
import logo from "../assets/logo.gif";
import SimpleBar from "simplebar-react";
import client from "../client";
import Footer from "../utils/Footer";
import Loading from "../utils/Loading";
import IsolatedModal from "./IsolatedModal";

const OAUTH_LOGIN = `${process.env.REACT_APP_CONTESTS_API}/oauth/twitch?redirect=reviews`;

export default function Reviews(props) {
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [reviews, setReviews] = useState(undefined);
  const { user, channel } = props;

  useEffect(() => {
    document.title = `Friday Reviews - ${channel}`;
    const fetchReviews = async () => {
      await client
        .service("reviews")
        .find({
          query: {
            $sort: {
              id: 1,
            },
          },
        })
        .then((res) => {
          setReviews(res.data);
        });
    };
    fetchReviews();
    return;
  }, [channel]);

  const login = () => {
    window.location.href = OAUTH_LOGIN;
  };

  if (user === undefined || reviews === undefined) return <Loading />;

  //display only active reviews if not mod/admin
  let reviewsToDisplay;
  if (user && (user.type === "admin" || user.type === "mod")) {
    reviewsToDisplay = reviews;
  } else {
    reviewsToDisplay = reviews.filter((review) => review.active);
  }

  return (
    <SimpleBar style={{ minHeight: 0, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 1, flexDirection: "column", width: "100%" }}>
        <Box sx={{ p: 2, width: "100%" }}>
          <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Box sx={{ mt: 2, minWidth: `${isMobile ? "100%" : "50%"}` }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                  <img style={{ height: "auto" }} src={logo} alt="" />
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                    <Typography variant="h3" fontWeight={600} color="primary">
                      Nymn's Friday Reviews
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {!user && (
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
                    )}

                    {user && (user.type === "admin" || user.type === "mod") && <IsolatedModal type={"Creation"} user={user} />}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: 2, width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <Box sx={{ mt: 2, width: `${isMobile ? "100%" : "50%"}` }}>
                {reviewsToDisplay.map((data, _) => {
                  return (
                    <Paper key={data.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 4, mt: 2 }}>
                      <Box>
                        <Typography variant="body2" color="red" sx={{ textTransform: "uppercase" }}>
                          {data.active ? "Active" : "Inactive"}
                        </Typography>
                        <Typography variant="h5" sx={{ textTransform: "uppercase" }} color="primary">{`${data.title}`}</Typography>
                        <Typography variant="h6" sx={{ mt: 1 }}>{`${data.description ?? ""}`}</Typography>
                        <Typography variant="h6" sx={{ textTransform: "uppercase", mt: 1 }} color="primary">{`${data.review_submissions.length} Submissions`}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
                        {user && (user.type === "admin" || user.type === "mod") && (
                          <>
                            <Box sx={{ p: 1 }}>
                              <Button href={`/review/${data.id}/manage`} variant="contained" color="error">
                                Manage
                              </Button>
                            </Box>
                            <Box sx={{ p: 1 }}>
                              <IsolatedModal type={"Edit"} user={user} review={data} />
                            </Box>
                          </>
                        )}
                        <Box sx={{ p: 1 }}>
                          <IsolatedModal type={"Submit"} user={user} review={data} />
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </SimpleBar>
  );
}
