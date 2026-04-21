import { Outlet } from "react-router-dom";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import SideMenu from "../SideMenu";

const HEADER_HEIGHT = 56;
const SIDEMENU_WIDTH = 260;

const AdminLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/login";
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* ===== 左：SideMenu（完全固定） ===== */}
      <Box
        sx={{
          width: SIDEMENU_WIDTH,
          flexShrink: 0,
          borderRight: "1px solid #ddd",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          bgcolor: "#fafafa",
          zIndex: 1100,
        }}
      >
        <SideMenu />
      </Box>

      {/* ===== 右：メインエリア ===== */}
      <Box
        sx={{
          flexGrow: 1,
          ml: `${SIDEMENU_WIDTH}px`,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ===== ヘッダー（完全固定） ===== */}
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            height: HEADER_HEIGHT,
            justifyContent: "center",
            bgcolor: "#ffffff",
            color: "#333",
            borderBottom: "1px solid #ddd",
            zIndex: 1200,
          }}
        >
          <Toolbar
            sx={{
              minHeight: HEADER_HEIGHT,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              競馬予想 管理画面
            </Typography>

            <IconButton onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* ===== 中身（ここだけスクロール） ===== */}
        <Box
          sx={{
            mt: `${HEADER_HEIGHT}px`,
            p: 3,
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            overflowY: "auto",
            bgcolor: "#f5f5f5",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
