import { Routes, Route, Navigate } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard/DashboardPage";
import ProductListPage from "./pages/Product/ProductListPage";
import ProductCreatePage from "./pages/Product/ProductCreatePage";
import ProductEditPage from "./pages/Product/ProductEditPage";

import HitResultListPage from "./pages/HitResult/HitResultListPage";
import HitResultCreatePage from "./pages/HitResult/HitResultCreatePage";

import ReviewListPage from "./pages/Review/ReviewListPage";
import ReviewCreatePage from "./pages/Review/ReviewCreatePage";

import SiteListPage from "./pages/Site/SiteListPage";
import SiteCreatePage from "./pages/Site/SiteCreatePage";
import SiteEditPage from "./pages/Site/SiteEditPage";

import ArticleListPage from "./pages/Article/ArticleListPage";
import ArticleCreatePage from "./pages/Article/ArticleCreatePage";
import ArticleEditPage from "./pages/Article/ArticleEditPage";

import FrameTrendListPage from "./pages/FrameTrend/FrameTrendListPage";
import FrameTrendCreatePage from "./pages/FrameTrend/FrameTrendCreatePage";
import FrameTrendEditPage from "./pages/FrameTrend/FrameTrendEditPage";
import FrameTrendInputPage from "@pages/FrameTrend/FrameTrendInputPage";

import RaceChangeHighlightListPage from "./pages/RaceChangeHighlight/RaceChangeHighlightListPage";
import RaceChangeHighlightCreatePage from "./pages/RaceChangeHighlight/RaceChangeHighlightCreatePage";
import RaceChangeHighlightEditPage from "./pages/RaceChangeHighlight/RaceChangeHighlightEditPage";

import AssistantMessageListPage from "./pages/AssistantMessage/AssistantMessageListPage";
import AssistantMessageCreatePage from "./pages/AssistantMessage/AssistantMessageCreatePage";
import AssistantMessageEditPage from "./pages/AssistantMessage/AssistantMessageEditPage";

import ChatFaqListPage from "@pages/ChatFaq/ChatFaqListPage";
import ChatFaqCreatePage from "@pages/ChatFaq/ChatFaqCreatePage";
import ChatFaqEditPage from "@pages/ChatFaq/ChatFaqEditPage";
import ChatQuestionLogListPage from "@pages/ChatQuestionLog/ChatQuestionLogListPage";

import Login from "./pages/Login/LoginPage";

/**
 * 仮ページ
 * 後で本実装の pages に差し替えればOK
 */



const DiagnosisPage = () => <div>おすすめ診断管理ページ</div>;

const App = () => {
  return (
    <Routes>
      {/* ログイン */}
      <Route path="/login" element={<Login />} />

      {/* 管理画面共通レイアウト */}
      <Route
        element={
          <AuthGuard>
            <AdminLayout />
          </AuthGuard>
        }
      >
        {/* 初期遷移 */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ダッシュボード */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 無料予想管理（旧: 商品管理） */}
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/new" element={<ProductCreatePage />} />
        <Route path="/products/:id/edit" element={<ProductEditPage />} />

        {/* 実績管理（旧: 的中実績管理） */}
        <Route path="/hit-results" element={<HitResultListPage />} />
        <Route path="/hit-results/new" element={<HitResultCreatePage />} />

        {/* クチコミ管理（旧: レビュー管理） */}
        <Route path="/reviews" element={<ReviewListPage />} />
        <Route path="/reviews/create" element={<ReviewCreatePage />} />

        {/* 掲載サイト管理 */}
        <Route path="/sites" element={<SiteListPage />} />
        <Route path="/sites/new" element={<SiteCreatePage />} />
        <Route path="/sites/:id/edit" element={<SiteEditPage />} />

        {/* 記事管理 */}
        <Route path="/articles" element={<ArticleListPage />} />
        <Route path="/articles/new" element={<ArticleCreatePage />} />
        <Route path="/articles/:id/edit" element={<ArticleEditPage />} />

        {/* おすすめ診断管理 */}
        <Route path="/diagnosis" element={<DiagnosisPage />} />
        
        {/* 枠順トレンド管理 */}
        <Route path="/frame-trends" element={<FrameTrendListPage />} />
        <Route path="/frame-trends/create" element={<FrameTrendCreatePage />} />
        <Route path="/frame-trends/:id/edit" element={<FrameTrendEditPage />} />
        <Route path="/frame-trends/input" element={<FrameTrendInputPage />} />

        {/* レース変更ハイライト管理 */}
        <Route path="/race-change-highlights" element={<RaceChangeHighlightListPage />} />
        <Route path="/race-change-highlights/create" element={<RaceChangeHighlightCreatePage />} />
        <Route path="/race-change-highlights/:id/edit" element={<RaceChangeHighlightEditPage />} />

        {/* 秘書メッセージ管理 */}
        <Route path="/assistant-messages" element={<AssistantMessageListPage />} />
        <Route path="/assistant-messages/create" element={<AssistantMessageCreatePage />} />
        <Route path="/assistant-messages/:id/edit" element={<AssistantMessageEditPage />} />

        {/* チャットFAQ管理 */}
        <Route path="/chat-faqs" element={<ChatFaqListPage />} />
        <Route path="/chat-faqs/create" element={<ChatFaqCreatePage />} />
        <Route path="/chat-faqs/:id/edit" element={<ChatFaqEditPage />} />

        {/* チャット質問ログ */}
        <Route path="/chat-question-logs" element={<ChatQuestionLogListPage />} />
      </Route>
      

      {/* 保険 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;