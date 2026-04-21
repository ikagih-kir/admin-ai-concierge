import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import SideMenu from "../components/SideMenu";
import Header from "../components/Header";

const SIDE_MENU_WIDTH = 260;
const HEADER_HEIGHT = 64;

const AdminLayout = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f6f8" }}>
      {/* 左固定メニュー */}
      <SideMenu />

      {/* 右側コンテンツ */}
      <Box
        sx={{
          ml: `${SIDE_MENU_WIDTH}px`,
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            bgcolor: "#fff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Header />
        </Box>

        <Box
          sx={{
            minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
            p: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;