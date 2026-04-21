import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const drawerWidth = 220;

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Users", path: "/users" },
  { label: "Payments", path: "/payments/errors" },
  { label: "Mails", path: "/mails" },
  { label: "Ads", path: "/ads" },
  { label: "Logs", path: "/logs" },
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            onClick={() => navigate(item.path)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
