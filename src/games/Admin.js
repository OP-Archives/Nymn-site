import { IconButton, Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Divider, Menu, Switch } from "@mui/material";
import client from "../client";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import { useState } from "react";

export default function Admin(props) {
  const { user, game } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const removeGame = () => {
    const confirmDialog = window.confirm("Are you sure?");
    if (!confirmDialog) return;
    client
      .service("games")
      .remove(game.id)
      .catch((e) => {
        console.error(e);
      });
  };

  const markAsPlayed = () => {
    client
      .service("games")
      .patch(game.id, {
        played: !game.played,
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const markAsHidden = () => {
    client
      .service("games")
      .patch(game.id, {
        hidden: !game.hidden,
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const banUser = () => {
    const confirmDialog = window.confirm("Are you sure?");
    if (!confirmDialog) return;
    client
      .service("users")
      .patch(game.user.id, {
        banned: !game.user.banned,
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const SUPERUSER = user && (user.type.toUpperCase() === "MOD" || user.type.toUpperCase() === "ADMIN");
  if (!SUPERUSER) return null;

  return (
    <>
      <IconButton aria-label="settings" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} MenuListProps={{ sx: { p: 0 } }}>
        <Paper>
          <MenuList>
            <MenuItem onClick={markAsPlayed}>
              <Switch checked={game.played} />
              <ListItemText>{"Played"}</ListItemText>
            </MenuItem>
            <MenuItem onClick={markAsHidden}>
              <Switch checked={game.hidden} />
              <ListItemText>{"Hidden"}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={removeGame}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Remove Game</ListItemText>
            </MenuItem>
            <MenuItem onClick={banUser}>
              <ListItemIcon>
                <BlockIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{game.user.banned ? "Unban User" : "Ban User"}</ListItemText>
            </MenuItem>
          </MenuList>
        </Paper>
      </Menu>
    </>
  );
}
