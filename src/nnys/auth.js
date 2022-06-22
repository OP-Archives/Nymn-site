import { Alert, Box, TextField } from "@mui/material";
import { useState } from "react";

export default function Auth(props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePasswordChange = (evt) => {
    setError(false);
    setPassword(evt.target.value);
  };

  const handlePasswordSubmit = async (evt) => {
    if (!evt || evt.which !== 13 || password.length === 0) return;

    await fetch(`https://api.nymn.gg/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(true);
          return setErrorMsg(data.msg);
        }

        setError(false);
        props.setPassword(password);
      })
      .catch((e) => {
        setError(true);
        setErrorMsg("Server encountered an error!");
      });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {error && <Alert severity="error">{errorMsg}</Alert>}
      <TextField
        error={error}
        autoFocus
        variant="outlined"
        name="password"
        placeholder="Password"
        type="password"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        onChange={handlePasswordChange}
        onKeyPress={handlePasswordSubmit}
        helperText="Enter password to access"
        margin="dense"
      />
    </Box>
  );
}
