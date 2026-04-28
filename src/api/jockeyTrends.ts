import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.keiba-ai-concierge.link";

export type MeetingType = "central" | "local";

export type JockeyTrendItem = {
  id: number;
  race_date: string;
  venue?: string | null;
  meeting_type: MeetingType;
  race_no: number;
  race_name?: string | null;
  jockey_name: string;
  horse_name?: string | null;
  memo?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type JockeyTrendCreate = {
  race_date: string;
  venue?: string;
  meeting_type: MeetingType;
  race_no: number;
  race_name?: string;
  jockey_name: string;
  horse_name?: string;
  memo?: string;
  is_published: boolean;
};

export async function fetchJockeyTrends(params?: {
  race_date?: string;
  meeting_type?: MeetingType;
  venue?: string;
}) {
  const res = await axios.get<JockeyTrendItem[]>(
    `${API_BASE_URL}/admin/jockey-trends`,
    { params }
  );
  return res.data;
}

export async function createJockeyTrend(data: JockeyTrendCreate) {
  const res = await axios.post<JockeyTrendItem>(
    `${API_BASE_URL}/admin/jockey-trends`,
    data
  );
  return res.data;
}

export async function deleteJockeyTrend(id: number) {
  const res = await axios.delete(`${API_BASE_URL}/admin/jockey-trends/${id}`);
  return res.data;
}