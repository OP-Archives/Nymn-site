import { Box, Button, Alert, TextField } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import client from "./client";

export default function LinkSubmission(props) {
  const [link, setLink] = useState(undefined);
  const [error, setError] = useState(undefined);
  const [success, setSuccess] = useState(undefined);

  const submit = async () => {
    if (!link && link.length === 0) return;

    const { accessToken } = await client.get("authentication");
    await axios({
      method: "post",
      url: "https://api.nymn.gg/submit",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        link: link,
      },
    })
      .then((data) => {
        if (data.error) {
          setError(`Server encountered an error!`);
          return;
        }
        setSuccess(true);
      })
      .catch((error) => {
        setError(`Server encountered an error!`);
        console.error(error);
      });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", mb: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Enter a link" type="text" onChange={(e) => setLink(e.target.value)} />
      <Button onClick={submit} variant="contained" component="label" color="nnys" sx={{ mt: 2 }}>
        Submit Video
      </Button>
      {success && (
        <Alert sx={{ mt: 2 }} severity="success">
          Submission completed! You may exit now.
        </Alert>
      )}
    </Box>
  );
}
