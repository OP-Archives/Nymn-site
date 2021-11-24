import { BrowserRouter, Route, Routes } from "react-router-dom";
import Vods from "./vods";
import VodPlayer from "./vod_player";
import Navbar from "./navbar";
import { createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material/styles";
import { CssBaseline, styled } from "@mui/material";
import { blue } from "@mui/material/colors";
import Submission from "./submission";
import Merch from "./Merch";

const channel = "nymn",
  twitchId = "62300805";

export default function App() {
  let darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#0e0e10",
      },
      primary: {
        main: blue[500],
      },
      secondary: {
        main: "#292828",
      },
      nnys: {
        main: "#cc9a1c",
      },
    },
    components: {
      MuiDrawer: {
        styleOverrides: {
          paper: {
            color: "white",
            backgroundImage: "none",
          },
        },
      },
    },
  });

  darkTheme = responsiveFontSizes(darkTheme);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            exact
            path="/"
            element={
              <Parent>
                <Navbar />
                <Vods channel={channel} twitchId={twitchId} />
              </Parent>
            }
          />
          <Route
            exact
            path="/vods"
            element={
              <Parent>
                <Navbar />
                <Vods channel={channel} twitchId={twitchId} />
              </Parent>
            }
          />
          <Route
            exact
            path="/vods/:vodId"
            element={
              <Parent>
                <VodPlayer channel={channel} type={"vod"} twitchId={twitchId} />
              </Parent>
            }
          />
          <Route
            exact
            path="/submit"
            element={
              <Parent>
                <Navbar />
                <Submission />
              </Parent>
            }
          />
          <Route exact path="/merch" element={<Merch />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

const Parent = styled((props) => <div {...props} />)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
`;
