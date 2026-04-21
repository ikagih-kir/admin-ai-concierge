import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layouts/AdminLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProductListPage from "../pages/Product/ProductListPage";
import HitResultListPage from "../pages/HitResult/HitResultListPage";
import ChatLogListPage from "../pages/ChatLog/ChatLogListPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/hit-results" element={<HitResultListPage />} />
        <Route path="/chat/logs" element={<ChatLogListPage />} />
        {/* ← ここに今後どんどん追加 */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
