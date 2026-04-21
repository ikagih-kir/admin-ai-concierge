import { AppBar, Toolbar, Typography } from "@mui/material";

const TopBar = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e0e0e0",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ color: "#333", fontWeight: "bold" }}
        >
          Admin Panel
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
