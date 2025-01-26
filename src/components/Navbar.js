import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2", boxShadow: "none" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <LocationOnIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Geo Video Recorder
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
