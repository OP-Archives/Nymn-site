import React, { useState, useEffect, useMemo } from "react";
import { Typography, Button, Box, useMediaQuery, Paper, IconButton, TextField } from "@mui/material";
import client from "../client";
import Redirect from "../utils/Redirect";
import { useParams } from "react-router-dom";
import Loading from "../utils/Loading";
import SimpleBar from "simplebar-react";
import Footer from "../utils/Footer";
import logo from "../assets/logo.gif";
import YoutubePlayer from "./YoutubePlayer";
import CustomLink from "../utils/CustomLink";
import debounce from "lodash.debounce";
import Image from "./Image";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";

export default function Manage(props) {
  const { user, channel } = props;
  const params = useParams();
  const reviewId = params.reviewId;
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [review, setReview] = useState(undefined);
  const [submissions, setSubmissions] = useState(undefined);
  const [submission, setSubmission] = useState(undefined);
  const [ui, setUi] = useState("all");

  useEffect(() => {
    document.title = `Friday Review ${reviewId} - ${channel}`;
    const fetchReview = async () => {
      await client
        .service("reviews")
        .get(reviewId)
        .then((data) => {
          setReview(data);
        })
        .catch(() => {
          setReview(null);
        });
    };
    fetchReview();
    return;
  }, [reviewId, channel]);

  useEffect(() => {
    setSubmissions(undefined);
    setSubmission(undefined);
    const fetchSubmissions = async () => {
      const res = await client
        .service("review_submissions")
        .find({
          query: {
            reviewId: reviewId,
            $sort: {
              id: 1,
            },
          },
        })
        .then((res) => res)
        .catch((e) => {
          console.error(e);
          return null;
        });

      switch (ui) {
        case "all":
          setSubmissions(res);
          break;
        case "denied":
          setSubmissions(res.filter((submission) => submission.status === "denied"));
          break;
        case "unapproved":
          setSubmissions(res.filter((submission) => submission.status === ""));
          break;
        case "approved":
          setSubmissions(res.filter((submission) => submission.status === "approved"));
          break;
        default:
          setSubmissions(res);
      }
    };
    fetchSubmissions();
  }, [ui, reviewId]);

  useEffect(() => {
    if (!submissions) return;
    setSubmission(submissions.length > 0 ? submissions[0] : null);
  }, [submissions]);

  const nextSubmission = (_) => {
    const nextIndex = submissions.findIndex((argSubmission) => argSubmission.id === submission.id) + 1;
    if (!submissions[nextIndex]) return;

    setSubmission(submissions[nextIndex]);
  };

  const prevSubmission = (_) => {
    const prevIndex = submissions.findIndex((argSubmission) => argSubmission.id === submission.id) - 1;
    if (!submissions[prevIndex]) return;

    setSubmission(submissions[prevIndex]);
  };

  const approve = async (_) => {
    await client
      .service("review_submissions")
      .patch(submission.id, {
        status: "approved",
      })
      .then((argSubmission) => {
        const index = submissions.findIndex((data) => data.id === argSubmission.id);
        submissions[index] = argSubmission;
        setSubmission(argSubmission);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const unapprove = async (_) => {
    const confirmDialog = window.confirm("Are you sure?");
    if (!confirmDialog) return;
    await client
      .service("review_submissions")
      .patch(submission.id, {
        status: "",
      })
      .then((argSubmission) => {
        const index = submissions.findIndex((data) => data.id === argSubmission.id);
        submissions[index] = argSubmission;
        setSubmission(argSubmission);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const deny = async (_) => {
    await client
      .service("review_submissions")
      .patch(submission.id, {
        status: "denied",
      })
      .then((argSubmission) => {
        const index = submissions.findIndex((data) => data.id === argSubmission.id);
        submissions[index] = argSubmission;
        setSubmission(argSubmission);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const ban = async (_) => {
    const confirmDialog = window.confirm("Are you sure?");
    if (!confirmDialog) return;
    await client
      .service("users")
      .patch(submission.userId, {
        banned: true,
      })
      .catch((e) => {
        console.error(e);
      });

    await client
      .service("review_submissions")
      .patch(submission.id, {
        status: "denied",
      })
      .then((argSubmission) => {
        const index = submissions.findIndex((data) => data.id === argSubmission.id);
        submissions[index] = argSubmission;
        setSubmission(argSubmission);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const remove = async (_) => {
    const confirmDialog = window.confirm("Are you sure?");
    if (!confirmDialog) return;
    await client
      .service("review_submissions")
      .remove(submission.id)
      .then(() => {
        const index = submissions.findIndex((argSubmission) => argSubmission.id === submission.id);
        if (index === -1) return;
        submissions.splice(index, 1);
        setSubmission(submissions[index] ? submissions[index] : submissions[index - 1] ? submissions[index - 1] : submissions[index + 1] ? submissions[index + 1] : undefined);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const submissionIdDebounce = useMemo(() => {
    const submissionIdChange = (evt) => {
      if (evt.target.value.length === 0) return;
      const value = Number(evt.target.value);
      if (isNaN(value)) return;
      if (value < 0) return;

      const index = submissions.findIndex((argSubmission) => argSubmission.id === evt.target.value);
      if (index === -1) return;

      setSubmission(submissions[index]);
    };
    return debounce(submissionIdChange, 600);
  }, [submissions]);

  const indexDebounce = useMemo(() => {
    const indexChange = (evt) => {
      if (evt.target.value.length === 0) return;
      const value = Number(evt.target.value) - 1;
      if (isNaN(value)) return;
      if (value < 0) return;

      if (!submissions[value]) return;
      setSubmission(submissions[value]);
    };
    return debounce(indexChange, 600);
  }, [submissions]);

  if (user === undefined || review === undefined) return <Loading />;
  if (!review) return <Redirect to="/review" />;
  if (!user) return <Redirect to="/review" />;
  if (user.type !== "mod" && user.type !== "admin") return <Redirect to="/review" />;

  const currentIndex = submissions && submission ? submissions.findIndex((argSubmission) => argSubmission.id === submission.id) + 1 : undefined;

  return (
    <SimpleBar style={{ minHeight: 0, height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "center", width: "100%", mt: 2, mb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", width: `${isMobile ? "100%" : "75%"}` }}>
          <Paper sx={{ pl: 6, pr: 6, pt: 2, pb: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <img style={{ height: "auto" }} src={logo} alt="" />
              <Box sx={{ display: "flex", mt: 2, flexDirection: isMobile ? "column" : "row" }}>
                <Button sx={{ m: 1 }} variant="contained" onClick={(_) => setUi("all")}>
                  ALL
                </Button>
                <Button sx={{ m: 1 }} variant="contained" onClick={(_) => setUi("denied")}>
                  Denied
                </Button>
                <Button sx={{ m: 1 }} variant="contained" onClick={(_) => setUi("unapproved")}>
                  Unapproved
                </Button>
                <Button sx={{ m: 1 }} variant="contained" onClick={(_) => setUi("approved")}>
                  Approved
                </Button>
              </Box>

              <Box sx={{ display: "flex", mt: 1, flexDirection: "column", width: "100%", height: "100%" }}>
                {submissions === undefined && <Loading />}
                {submissions && submission && (
                  <>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>{`Submission ID:`}</Typography>
                        <TextField
                          key={submission.id}
                          type="text"
                          sx={{ width: `${submission.id.length * 1.5}rem` }}
                          inputProps={{ sx: { textAlign: "center" } }}
                          autoCapitalize="off"
                          autoCorrect="off"
                          autoComplete="off"
                          size="small"
                          defaultValue={submission.id}
                          onFocus={(e) => e.target.select()}
                          onChange={submissionIdDebounce}
                        />
                      </Box>
                      <Box sx={{ display: "flex" }}>
                        <Typography variant="h6" sx={{ mr: 0.5 }}>{`Status:`}</Typography>
                        <Typography variant="h6" color={submission.status === "approved" ? "primary" : submission.status === "" ? "textSecondary" : "error"} sx={{ textTransform: "uppercase" }}>{`${
                          submission.status === "" ? "Not Approved" : submission.status
                        }`}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TextField
                          key={currentIndex}
                          type="text"
                          sx={{ width: `${submissions.length.toString().length * 1.5}rem`, mr: 1 }}
                          inputProps={{ sx: { textAlign: "center" } }}
                          autoCapitalize="off"
                          autoCorrect="off"
                          autoComplete="off"
                          size="small"
                          defaultValue={currentIndex}
                          onFocus={(e) => e.target.select()}
                          onChange={indexDebounce}
                        />
                        <Typography variant="h6">{`/ ${submissions.length}`}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                      <IconButton variant="outlined" onClick={() => setSubmission(submissions[0])}>
                        <FirstPageIcon color="primary" fontSize="large" />
                      </IconButton>
                      <IconButton variant="outlined" onClick={prevSubmission}>
                        <KeyboardArrowLeftIcon color="primary" fontSize="large" />
                      </IconButton>
                      <IconButton variant="outlined" onClick={nextSubmission}>
                        <KeyboardArrowRightIcon color="primary" fontSize="large" />
                      </IconButton>
                      <IconButton variant="outlined" onClick={() => setSubmission(submissions[submissions.length - 1])}>
                        <LastPageIcon color="primary" fontSize="large" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", flexDirection: isMobile ? "column" : "row" }}>
                      {(submission.link?.source === "imgur" || !submission.link.source) && (
                        <Box sx={{ height: "100%", width: isMobile ? "100%" : "70%" }}>
                          <Image submission={submission} />
                        </Box>
                      )}

                      {(submission.link?.source === "youtube" || !submission.link.source) && (
                        <Box sx={{ height: "100%", width: isMobile ? "100%" : "60%" }}>
                          <YoutubePlayer submission={submission} />
                        </Box>
                      )}

                      {(submission.link?.source === "streamable" || !submission.link.source) && (
                        <Box sx={{ height: "100%", width: "100%" }}>
                          <iframe title={submission.link.id} src={`https://streamable.com/e/${submission.link.id}`} height="500px" width="100%" allowFullScreen={true} preload="auto" frameBorder="0" />
                        </Box>
                      )}
                    </Box>
                  </>
                )}
              </Box>

              {submissions && submission && (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", mt: 1, width: isMobile ? "100%" : "60%" }}>
                  <Typography variant="h5" color="primary">{`${submission.display_name}`}</Typography>
                  <CustomLink href={submission.link.link} target="_blank" rel="noreferrer noopener" color="textSecondary">
                    <Typography variant="caption" noWrap>{`${submission.link.link}`}</Typography>
                  </CustomLink>
                  <Typography variant="caption" sx={{ wordBreak: "break-word" }}>
                    {`${submission.comment}`}
                  </Typography>
                  {ui !== "approved" && (
                    <>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {submission.status === "denied" && (
                          <Button sx={{ m: 0.5 }} variant="outlined" onClick={unapprove}>
                            {`Un-Deny`}
                          </Button>
                        )}
                        {submission.status === "" && (
                          <>
                            <Button sx={{ m: 0.5 }} variant="outlined" onClick={approve}>
                              {`Approve`}
                            </Button>
                            <Button sx={{ m: 0.5 }} variant="outlined" onClick={deny} color="error">
                              {`Deny`}
                            </Button>
                          </>
                        )}
                        {submission.status === "approved" && (
                          <>
                            <Button sx={{ m: 0.5 }} variant="outlined" onClick={unapprove}>
                              {`Un-Approve`}
                            </Button>
                          </>
                        )}
                      </Box>
                      <Box sx={{ display: "flex" }}>
                        <Button sx={{ m: 0.5 }} variant="outlined" onClick={remove} color="error">
                          {`Remove`}
                        </Button>
                        <Button sx={{ m: 0.5 }} variant="outlined" onClick={ban} color="error">
                          {`Ban User`}
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Box>
            <Footer />
          </Paper>
        </Box>
      </Box>
    </SimpleBar>
  );
}
