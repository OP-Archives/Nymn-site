import React, { useEffect, useState, useMemo } from "react";
import { TextField, Box } from "@mui/material";
import debounce from "lodash.debounce";
import client from "../client";

export default function Search(props) {
  const { setGames } = props;
  const [search, setSearch] = useState(undefined);

  const debouncedSearch = useMemo(() => {
    const searchChange = (evt) => {
      setSearch(evt.target.value);
    };
    return debounce(searchChange, 300);
  }, []);

  useEffect(() => {
    if (search === undefined) return;
    setGames(undefined);
    const fetchSearch = async () => {
      await client
        .service("games")
        .find({
          query: {
            $or: [{ name: { $iLike: `%${search}%` } }],
          },
        })
        .then((res) => {
          console.log(res);
          setGames(res.data.sort((a, b) => b - a));
        })
        .catch((e) => {
          console.error(e);
          return null;
        });
    };
    fetchSearch();
  }, [search, setGames]);

  return (
    <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
      <TextField
        label="Search by Game Name"
        onChange={debouncedSearch}
        InputProps={{
          type: "search",
        }}
      />
    </Box>
  );
}
