import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const userStr = localStorage.getItem("user");

  let user = null;

  try {
    user = JSON.parse(userStr);
  } catch {
    user = null;
  }

  // ❌ chưa login hoặc lỗi
  if (!user || !user.id) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ✅ hợp lệ
  return children;
}