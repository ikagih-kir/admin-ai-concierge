import { useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

type MenuItem = {
  label: string;
  path?: string;
  children?: MenuItem[];
};

const menu: MenuItem[] = [
  {
    label: "メディア運営",
    children: [
      { label: "ダッシュボード", path: "/dashboard" },
      { label: "掲載サイト管理", path: "/sites" },
      { label: "条件変わり馬管理", path: "/race-change-highlights" },
      { label: "枠順トレンド管理", path: "/frame-trends" },
      { label: "秘書メッセージ管理", path: "/assistant-messages" },
      { label: "AIチャットFAQ管理", path: "/chat-faqs" },
      { label: "AIチャット質問ログ", path: "/chat-question-logs" },
      { label: "無料予想管理", path: "/products" },
      { label: "実績管理", path: "/hit-results" },
      { label: "クチコミ管理", path: "/reviews" },
      { label: "記事管理", path: "/articles" },
      { label: "おすすめ診断管理", path: "/diagnosis" },
    ],
  },
  {
    label: "新規作成",
    children: [
      { label: "無料予想を作成", path: "/products/new" },
      { label: "実績を作成", path: "/hit-results/new" },
      { label: "クチコミを作成", path: "/reviews/create" },
      { label: "掲載サイトを作成", path: "/sites/new" },
      { label: "条件変わり馬を作成", path: "/race-change-highlights/create" },
      { label: "枠順トレンドを作成", path: "/frame-trends/create" },
      { label: "秘書メッセージを作成", path: "/assistant-messages/create" },
      { label: "記事を作成", path: "/articles/new" },
    ],
  },
  {
    label: "設定",
    children: [
      { label: "サイト設定", path: "/settings/site" },
      { label: "管理者", path: "/settings/admins" },
      { label: "管理者権限", path: "/settings/roles" },
    ],
  },
];

const SIDE_MENU_WIDTH = 220;

export default function SideMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState<Record<string, boolean>>({
    メディア運営: true,
    新規作成: true,
    設定: false,
  });

  const toggle = (label: string) => {
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path?: string) => {
    if (!path) return false;

    if (path === "/products") {
      return (
        location.pathname === "/products" ||
        location.pathname.startsWith("/products/")
      );
    }

    if (path === "/hit-results") {
      return (
        location.pathname === "/hit-results" ||
        location.pathname.startsWith("/hit-results/")
      );
    }

    if (path === "/reviews") {
      return (
        location.pathname === "/reviews" ||
        location.pathname.startsWith("/reviews/")
      );
    }

    if (path === "/sites") {
      return (
        location.pathname === "/sites" ||
        location.pathname.startsWith("/sites/")
      );
    }

    if (path === "/race-change-highlights") {
      return (
        location.pathname === "/race-change-highlights" ||
        location.pathname.startsWith("/race-change-highlights/")
      );
    }

    if (path === "/frame-trends") {
      return (
        location.pathname === "/frame-trends" ||
        location.pathname.startsWith("/frame-trends/")
      );
    }

    if (path === "/assistant-messages") {
      return (
        location.pathname === "/assistant-messages" ||
        location.pathname.startsWith("/assistant-messages/")
      );
    }

    if (path === "/chat-faqs") {
      return (
        location.pathname === "/chat-faqs" ||
        location.pathname.startsWith("/chat-faqs/")
      );
    }

    if (path === "/chat-question-logs") {
      return (
        location.pathname === "/chat-question-logs" ||
        location.pathname.startsWith("/chat-question-logs/")
      );
    }

    if (path === "/articles") {
      return (
        location.pathname === "/articles" ||
        location.pathname.startsWith("/articles/")
      );
    }


    return location.pathname === path;
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: SIDE_MENU_WIDTH,
        height: "100vh",
        borderRight: "1px solid #e0e0e0",
        overflowY: "auto",
        bgcolor: "#fafafa",
        zIndex: 1200,
      }}
    >
      <Box p={2}>
        <Typography variant="h6">管理メニュー</Typography>
        <Typography variant="body2" color="text.secondary">
          競馬広告メディア管理
        </Typography>
      </Box>

      <List dense>
        {menu.map((group) => (
          <Box key={group.label}>
            <ListItemButton
              onClick={() => toggle(group.label)}
              sx={{ py: 0.5 }}
            >
            <ListItemText
              primary={group.label}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 600,
              }}
            />
            {open[group.label] ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
          </ListItemButton>
            <Collapse in={open[group.label]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {group.children?.map((item) => (
                  <ListItemButton
                    key={item.label}
                    sx={{ pl: 3, py: 0.4 }}
                    selected={isActive(item.path)}
                    onClick={() => item.path && navigate(item.path)}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 13,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>
    </Box>
  );
}