import { useMediaQuery, Box, Paper, Typography } from "@mui/material";
import NNYS_TITLE from "../assets/nnys/NNYS_Logo_3D_Color1.png";
import { useState } from "react";
import Auth from "./auth";
import NNYS_MAIN from "../assets/nnys/Background.png";
import SimpleBar from "simplebar-react";
import Record from "./record";
import Upload from "./upload";
import CustomButton from "../utils/CustomButton";

export default function Submission(props) {
  const isMobile = useMediaQuery("(max-width: 800px)");
  const [password, setPassword] = useState("");
  const [component, setComponent] = useState(null);

  const showRecordComponent = () => {
    setComponent("record");
  };

  const showUploadComponent = () => {
    setComponent("upload");
  };

  return (
    <SimpleBar style={{ minHeight: 0, height: "100%", backgroundImage: `url(${NNYS_MAIN})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
      <Box sx={{ height: "100%", alignItems: "center", display: "flex", flexDirection: "column" }}>
        <img alt="" src={NNYS_TITLE} style={{ width: isMobile ? "100%" : "50%" }} />
        {password.length === 0 ? (
          <Paper>
            <Auth setPassword={setPassword} />
          </Paper>
        ) : (
          <Box sx={{ maxWidth: "900px", mb: 5, p: 1 }}>
            <Paper variant="outlined" sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
              <Box sx={{ textAlign: "center" }}>
                <Box sx={{ m: 1 }}>
                  <Typography variant="body1">
                    The video doesn't have to be very long - briefly try to summarize the year 2021 in whatever way you see fit, and what you look forward to in 2023. Thank you!
                  </Typography>
                </Box>
                <Box sx={{ m: 1 }}>
                  <Typography color="red" variant="body1" sx={{ fontWeight: "bold" }}>
                    Latest date for submission: DECEMBER 20, 2022.
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", mb: 2 }}>
                <Box sx={{ m: 1 }}>
                  <CustomButton variant="contained" onClick={showUploadComponent} color="nnys">
                    Upload
                  </CustomButton>
                </Box>
                <Box sx={{ m: 1 }}>
                  <CustomButton variant="contained" onClick={showRecordComponent} color="nnys">
                    Record
                  </CustomButton>
                </Box>
              </Box>
              {component === "record" ? <Record password={password} /> : component === "upload" ? <Upload password={password} /> : <></>}
            </Paper>
          </Box>
        )}
      </Box>
    </SimpleBar>
  );
}
