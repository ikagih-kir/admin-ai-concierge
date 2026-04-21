export type MailStatus = "draft" | "scheduled" | "sent" | "canceled";

export type MailCondition = {
  // 運営確定まで仮：後で拡張しやすい形
  tags?: string[];
  isActiveOnly?: boolean;        // 有効ユーザーのみ
  purchased?: "any" | "paid" | "unpaid";
  registeredFrom?: string;       // ISO date (YYYY-MM-DD)
  registeredTo?: string;         // ISO date (YYYY-MM-DD)
  os?: "any" | "ios" | "android";
};

export type MailReservation = {
  id: number;
  title: string;           // 管理用タイトル
  subject: string;
  status: MailStatus;
  scheduled_at?: string;   // ISO datetime
  sent_at?: string;        // ISO datetime
  created_at: string;      // ISO datetime
  updated_at: string;      // ISO datetime
  target_summary: string;  // 例: "有効ユーザー / タグ: VIP / 未購入"
};

export type MailCreatePayload = {
  title: string;
  subject: string;
  from_name: string;
  from_email: string;

  // 本文
  body_text?: string;
  body_html?: string;
  format: "text" | "html";

  // 予約
  scheduled_at?: string; // ISO datetime
  status: "draft" | "scheduled";

  // 条件
  condition: MailCondition;
};

export type MailForm = {
  title: string;
  body: string;
  product_id: number | null;
};
