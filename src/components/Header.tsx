import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: "#ffffff",
        color: "#333",
        borderBottom: "1px solid #e0e0e0",
        zIndex: (theme) => theme.zIndex.drawer + 1, // ← SideMenuより前面
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 56,
        }}
      >
        {/* 左：サイト名 */}
        <Typography variant="h6" fontWeight="bold">
          競馬予想 管理画面
        </Typography>

        {/* 右：操作エリア */}
        <Box display="flex" alignItems="center" gap={2}>
          {/* 将来ここに管理者名や通知アイコンを置ける */}
          <Button
            variant="outlined"
            size="small"
            color="inherit"
            onClick={handleLogout}
          >
            ログアウト
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
