import { Box, Paper, Button, SvgIcon } from "@mui/material";
import SimpleBar from "simplebar-react";
import Upload from "./upload";
import { useState, useEffect } from "react";
import client from "./client";

export default function Submission(props) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    client.authenticate().catch(() => setUser(null));

    client.on("authenticated", (paramUser) => {
      setUser(paramUser.user);
    });

    client.on("logout", () => {
      setUser(null);
      window.location.href = "/";
    });

    return;
  }, []);

  const login = () => {
    window.location.href = "https://api.nymn.gg/oauth/twitch";
  };

  return (
    <SimpleBar style={{ minHeight: 0, height: "100%" }}>
      <Box sx={{ height: "100%", alignItems: "center", display: "flex", flexDirection: "column" }}>
        <Box sx={{ maxWidth: "900px", mb: 5, p: 1 }}>
          <Paper variant="outlined" sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <Box sx={{ textAlign: "center" }}>
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
            </Box>
            <Box sx={{ mt: 2 }}>{user && <Upload />}</Box>
          </Paper>
        </Box>
      </Box>
    </SimpleBar>
  );
}
