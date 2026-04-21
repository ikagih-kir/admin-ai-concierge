import LoginIcon from "@mui/icons-material/Login";
import PaymentIcon from "@mui/icons-material/Payment";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import CampaignIcon from "@mui/icons-material/Campaign";
import { ReactElement } from "react"; // 👈 ここ重要
import WarningIcon from "@mui/icons-material/Warning";


export type OperationLogMeta = {
  label: string;
  color: "primary" | "success" | "error" | "warning" | "info";
  icon: ReactElement; // ✅ ReactNode → ReactElement
};

export const OPERATION_LOG_MAP: Record<string, OperationLogMeta> = {
  login: {
    label: "ログイン",
    color: "info",
    icon: <LoginIcon fontSize="small" />,
  },
  retry_payment: {
    label: "再決済",
    color: "warning",
    icon: <PaymentIcon fontSize="small" />,
  },
  resolve_payment: {
    label: "対応済み",
    color: "success",
    icon: <DoneIcon fontSize="small" />,
  },
  update_user: {
    label: "ユーザー更新",
    color: "primary",
    icon: <EditIcon fontSize="small" />,
  },
  update_ads: {
    label: "広告設定",
    color: "info",
    icon: <CampaignIcon fontSize="small" />,
  },
};

export const OPERATION_LOG_ROW_STYLE: Record<string, string> = {
  login: "#E3F2FD",          // 薄い青
  retry_payment: "#FFF8E1",  // 薄い黄（要注意）
  resolve_payment: "#E8F5E9",// 薄い緑（安全）
  update_user: "#EDE7F6",    // 薄い紫
  update_ads: "#FCE4EC",     // 薄い赤（重要）
};

export const DANGEROUS_ACTIONS = [
  "retry_payment",
  "update_ads",
  "update_user",
];

export const OPERATION_LOG_ACTION_META: Record<
  string,
  { label: string; icon?: React.ReactElement }
> = {
  login: {
    label: "ログイン",
  },
  retry_payment: {
    label: "再決済",
    icon: <PaymentIcon fontSize="small" />,
  },
  resolve_payment: {
    label: "対応済み",
  },
  update_user: {
    label: "ユーザー変更",
    icon: <EditIcon fontSize="small" />,
  },
  update_ads: {
    label: "広告変更",
    icon: <WarningIcon fontSize="small" />,
  },
};