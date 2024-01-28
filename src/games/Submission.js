import React, { useState, useEffect } from "react";
import { Typography, Button, Box, TextField, Autocomplete, Popper, ListSubheader, styled, useTheme, useMediaQuery, Link, Chip } from "@mui/material";
import logo from "../assets/logo.gif";
import { Alert } from "@mui/material";
import client from "../client";
import Loading from "../utils/Loading";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { VariableSizeList } from "react-window";
import CustomLink from "../utils/CustomLink";

const API_BASE = process.env.REACT_APP_CONTESTS_API;
const BASE_STEAM_LINK = "https://store.steampowered.com/app";
const LISTBOX_PADDING = 8; // px

export default function Submission(props) {
  const [error, setError] = useState(null);
  const [errorMsg, setErrorMsg] = useState(undefined);
  const [apps, setApps] = useState([]);
  const [app, setApp] = useState(null);
  const [game, setGame] = useState(undefined);
  const { user } = props;

  useEffect(() => {
    const fetchSteamAppsList = async () => {
      const { accessToken } = await client.get("authentication");
      await fetch(`${API_BASE}/v1/steam/apps`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setApps(response.applist.apps.filter((app) => app.name.length > 0));
        })
        .catch((e) => {
          console.error(e);
          return null;
        });
    };
    fetchSteamAppsList();
  }, []);

  useEffect(() => {
    if (!app) return;
    const fetchGameDetails = async () => {
      const { accessToken } = await client.get("authentication");
      await fetch(`${API_BASE}/v1/steam/apps/${app.appid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error) {
            setError(true);
            setErrorMsg("Failed to retrieve App Details");
            return null;
          }
          setGame(response);
        })
        .catch((e) => {
          console.error(e);
          return null;
        });
    };
    fetchGameDetails();
  }, [app]);

  const handleSubmit = async (evt) => {
    if (evt) evt.preventDefault();

    return client
      .service("games")
      .create({
        id: app.appid,
      })
      .then(() => {
        setError(false);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
        setErrorMsg(e.message);
      });
  };

  if (!apps || !user) return <Loading />;

  const steamLink = `${BASE_STEAM_LINK}/${game?.steam_appid}`;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <img alt="" src={logo} sx={{ height: "auto", width: "100%" }} />
      <Typography variant="h5" fontWeight={600} sx={{ textTransform: "uppercase", mt: 1 }} color="primary">
        {"Game Submission"}
      </Typography>
      {error === true && (
        <Alert sx={{ mt: 1 }} severity="error">
          {errorMsg}
        </Alert>
      )}
      {error === false && (
        <Alert sx={{ mt: 1 }} severity="success">
          {`Submitted ${app.name}`}
        </Alert>
      )}
      <Autocomplete
        disableListWrap
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={apps}
        getOptionLabel={(app) => app.name}
        renderOption={(props, option, state) => [props, option, state.index]}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Game"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
          />
        )}
        sx={{ flex: 1, pt: 1, pb: 1, width: "22rem" }}
        isOptionEqualToValue={(option) => app.appid === option.appid}
        onChange={(event, newApp) => {
          setError(undefined);
          setApp(newApp);
        }}
      />
      {game && (
        <>
          <Box
            sx={{
              overflow: "hidden",
              width: 324,
              height: 151,
              position: "relative",
              "&:hover": {
                boxShadow: "0 0 8px #fff",
              },
            }}
          >
            <Link href={steamLink} target="_blank" rel="noopener noreferrer">
              <img className="thumbnail" alt="" src={game.header_image} />
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
              <Box sx={{ justifyContent: "center", display: "flex", alignItems: "center", mb: 1 }}>
                {game.genres && game.genres.map((tag, _) => <Chip key={tag.id} size="small" color="info" variant="outlined" label={tag.description} sx={{ m: 0.3 }} />)}
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: "550" }}>
                {`${game.short_description.replaceAll("&quot;", '"') ?? ""}`}
              </Typography>
            </Box>
          </Box>
        </>
      )}
      <form noValidate>
        <Button disabled={!app || !game} sx={{ mt: 2 }} type="submit" fullWidth variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </form>
    </Box>
  );
}

const renderRow = (props) => {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
  };

  if (dataSet.hasOwnProperty("group")) {
    return (
      <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </ListSubheader>
    );
  }

  return (
    <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
      {`${dataSet[1].appid} - ${dataSet[1].name}`}
    </Typography>
  );
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <div ref={ref} {...props} {...outerProps} />;
});

const useResetCache = (data) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true);
    }
  }, [data]);
  return ref;
};

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;

  const itemData = [];
  children.forEach((item) => {
    itemData.push(item);
    itemData.push(...(item.children || []));
  });

  const theme = useTheme();
  const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
    noSsr: true,
  });
  const itemCount = itemData.length;
  const itemSize = smUp ? 36 : 48;

  const getChildSize = (child) => {
    if (child.hasOwnProperty("group")) {
      return 48;
    }

    return itemSize;
  };

  const getHeight = () => {
    if (itemCount > 8) {
      return 8 * itemSize;
    }
    return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
  };

  const gridRef = useResetCache(itemCount);

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * LISTBOX_PADDING}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});
