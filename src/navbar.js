import React from "react";
import { AppBar, Toolbar, List, ListItem, ListItemText, Divider, IconButton, Drawer, Box } from "@mui/material";
import Menu from "@mui/icons-material/Menu";
import Logo from "./assets/logo.gif";
import CustomLink from "./utils/CustomLink";

const mainLinks = [
  { title: `Home`, path: `/` },
  { title: `Vods`, path: `/vods` },
  { title: `Merch`, path: `https://nymn-official-merchandise.creator-spring.com` },
];
const socialLinks = [
  { title: `Twitch`, path: `https://twitch.tv/nymn` },
  { title: `Twitter`, path: `https://twitter.com/nymnion` },
  { title: `Reddit`, path: `https://reddit.com/r/RedditAndChill` },
  { title: `Discord`, path: `https://discord.gg/nymn` },
  { title: `Youtube`, path: `https://youtube.com/nymnion` },
];

export default function NavBar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <div>
      <Box sx={{ alignItems: "stretch", justifyContent: "center", display: "flex", flexShrink: 1, flexGrow: 1, mb: 1, mt: 1 }}>
        <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <a href="/">
            <img alt="" height="45px" src={Logo} />
          </a>
        </Box>
      </Box>
      <Divider />
      <List>
        {mainLinks.map(({ title, path }) => (
          <ListItem key={title} component={CustomLink} href={path}>
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {socialLinks.map(({ title, path }) => (
          <ListItem key={title} component={CustomLink} href={path} target="_blank" rel="noreferrer noopener">
            <ListItemText primary={title} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="static" color="inherit">
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
            <Menu />
          </IconButton>
          <Box sx={{ alignItems: "stretch", justifyContent: "center", display: "flex", flexShrink: 1, flexGrow: 1, mb: 1, mt: 1 }}>
            <Box sx={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <a href="/">
                <img alt="" height="45px" src={Logo} />
              </a>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <nav aria-label="navigation">
        <Drawer
          open={drawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
