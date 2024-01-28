import React, { useEffect, useState } from "react";
import { TextField, Autocomplete, Box, Chip, ListSubheader, Typography, useTheme, useMediaQuery, styled, Popper } from "@mui/material";
import client from "../client";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { VariableSizeList } from "react-window";

const API_BASE = process.env.REACT_APP_CONTESTS_API;
const LISTBOX_PADDING = 8; // px

export default function FilterTags(props) {
  const { setTags, user } = props;
  const [steamTags, setSteamTags] = useState([]);
  const loading = steamTags.length === 0;

  useEffect(() => {
    if (!user) return;
    const fetchTags = async () => {
      const { accessToken } = await client.get("authentication");
      await fetch(`${API_BASE}/v1/steam/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setSteamTags(response);
        })
        .catch((e) => {
          console.error(e);
          return null;
        });
    };
    fetchTags();
    return;
  }, [user]);

  return (
    <Box sx={{ flex: 1, display: "flex", justifyContent: "start" }}>
      <Autocomplete
        disableListWrap
        multiple
        clearOnBlur
        disabled={!user}
        loading={loading}
        PopperComponent={StyledPopper}
        ListboxComponent={ListboxComponent}
        options={steamTags}
        getOptionLabel={(steamTag) => steamTag.name}
        renderOption={(props, option, state) => [props, option, state.index]}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by Tags"
            inputProps={{
              ...params.inputProps,
              autoComplete: "new-password", // disable autocomplete and autofill
            }}
          />
        )}
        renderTags={(tags, getTagProps) => tags.map((tag, index) => <Chip size="small" label={tag.name} {...getTagProps({ index })} />)}
        sx={{ minWidth: "18rem" }}
        onChange={(event, newTags) => {
          setTags(newTags);
        }}
      />
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
      {`${dataSet[1].name}`}
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
