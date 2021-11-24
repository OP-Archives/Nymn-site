import { useMediaQuery, Grid, Box } from "@mui/material";
import Footer from "./utils/Footer";
import NNYS_TITLE from "./assets/NNYS_TITLE.png";
import { useState } from "react";
import Auth from "./auth";
import NNYS_MAIN from "./assets/NNYS_MAIN.jpg";
import SimpleBar from "simplebar-react";
import Record from "./record";
import Upload from "./upload";
import CustomButton from "./utils/CustomButton";

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
    <SimpleBar style={{ height: "calc(100% - 5rem)", backgroundImage: `url(${NNYS_MAIN})`, backgroundSize: "cover", backgroundRepeat: "no-repeat" }}>
      <Grid container sx={{ height: "100%", justifyContent: "center" }}>
        <Grid item xs={10} sx={{ textAlign: "center", mt: 2 }}>
          <img alt="" src={NNYS_TITLE} style={{ width: isMobile ? "100%" : "50%" }} />
        </Grid>
        <Grid item xs={10}>
          {password.length === 0 ? (
            <Auth setPassword={setPassword} />
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
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
            </Box>
          )}
        </Grid>
        <Grid item xs={4}>
          <Footer />
        </Grid>
      </Grid>
    </SimpleBar>
  );
}
