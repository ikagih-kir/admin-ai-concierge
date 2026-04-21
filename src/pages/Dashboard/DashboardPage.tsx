import { Box, Typography, Divider } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PublicIcon from "@mui/icons-material/Public";
import ArticleIcon from "@mui/icons-material/Article";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import QuizIcon from "@mui/icons-material/Quiz";
import InsightsIcon from "@mui/icons-material/Insights";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PsychologyIcon from "@mui/icons-material/Psychology";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DashboardCard from "../../components/Dashboard/DashboardCard";
import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "@api/dashboard";

const dashboardGridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: 2,
};

const DashboardPage = () => {
  const [productCount, setProductCount] = useState<number>(0);
  const [hitResultCount, setHitResultCount] = useState<number>(0);
  const [siteCount, setSiteCount] = useState<number>(0);
  const [articleCount, setArticleCount] = useState<number>(0);
  const [chatFaqCount, setChatFaqCount] = useState<number>(0);
  const [chatQuestionLogCount, setChatQuestionLogCount] = useState<number>(0);
  const [needsImprovementQuestionCount, setNeedsImprovementQuestionCount] =
    useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchDashboardSummary();
        setProductCount(data.product_count);
        setHitResultCount(data.hit_result_count);
        setSiteCount(data.site_count);
        setArticleCount(data.article_count);
        setChatFaqCount(data.chat_faq_count);
        setChatQuestionLogCount(data.chat_question_log_count);
        setNeedsImprovementQuestionCount(
          data.needs_improvement_question_count
        );
      } catch (e) {
        console.error("ダッシュボード集計取得失敗", e);
      }
    };

    load();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={1}>
        管理画面ダッシュボード
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        現在運用している主要機能と、よく使う管理ページをまとめています。
      </Typography>

      <Typography variant="h6" mb={2}>
        要確認
      </Typography>

      <Box sx={{ ...dashboardGridSx, mb: 4 }}>
        <DashboardCard
          title="要改善の質問ログ"
          description={`${needsImprovementQuestionCount} 件`}
          icon={<WarningAmberIcon sx={{ color: "#ef6c00" }} />}
          to="/chat-question-logs"
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" mb={2}>
        件数サマリー
      </Typography>

      <Box sx={{ ...dashboardGridSx, mb: 4 }}>
        <DashboardCard
          title="無料予想"
          description={`${productCount} 件`}
          icon={<InventoryIcon color="primary" />}
          to="/products"
        />
        <DashboardCard
          title="実績管理"
          description={`${hitResultCount} 件`}
          icon={<EmojiEventsIcon color="success" />}
          to="/hit-results"
        />
        <DashboardCard
          title="掲載サイト"
          description={`${siteCount} 件`}
          icon={<PublicIcon color="success" />}
          to="/sites"
        />
        <DashboardCard
          title="記事"
          description={`${articleCount} 件`}
          icon={<ArticleIcon color="warning" />}
          to="/articles"
        />
        <DashboardCard
          title="AIチャットFAQ"
          description={`${chatFaqCount} 件`}
          icon={<SmartToyIcon sx={{ color: "#00897b" }} />}
          to="/chat-faqs"
        />
        <DashboardCard
          title="AIチャット質問ログ"
          description={`${chatQuestionLogCount} 件`}
          icon={<QuizIcon sx={{ color: "#3949ab" }} />}
          to="/chat-question-logs"
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" mb={2}>
        メディア運営
      </Typography>

      <Box sx={{ ...dashboardGridSx, mb: 4 }}>
        <DashboardCard
          title="掲載サイト管理"
          description="掲載サイトの作成・編集・公開管理"
          icon={<PublicIcon color="success" />}
          to="/sites"
        />
        <DashboardCard
          title="枠順トレンド管理"
          description="中央・地方の枠順トレンドを管理"
          icon={<InsightsIcon color="secondary" />}
          to="/frame-trends"
        />
        <DashboardCard
          title="記事管理"
          description="記事の作成・編集・公開管理"
          icon={<ArticleIcon color="warning" />}
          to="/articles"
        />
        <DashboardCard
          title="クチコミ管理"
          description="投稿クチコミの確認・公開管理"
          icon={<RateReviewIcon color="info" />}
          to="/reviews"
        />
        <DashboardCard
          title="秘書メッセージ管理"
          description="Home用の秘書メッセージを管理"
          icon={<PsychologyIcon sx={{ color: "#8e24aa" }} />}
          to="/assistant-messages"
        />
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="h6" mb={2}>
        AIチャット運用
      </Typography>

      <Box sx={dashboardGridSx}>
        <DashboardCard
          title="AIチャットFAQ管理"
          description="よくある質問と模範回答を管理"
          icon={<SmartToyIcon sx={{ color: "#00897b" }} />}
          to="/chat-faqs"
        />
        <DashboardCard
          title="AIチャット質問ログ"
          description="実際の質問内容を確認して改善に活用"
          icon={<QuizIcon sx={{ color: "#3949ab" }} />}
          to="/chat-question-logs"
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;