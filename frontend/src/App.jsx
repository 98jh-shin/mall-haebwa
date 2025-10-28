import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/home-page";
import CartPage from "./pages/cart-page";
import ChatPage from "./pages/chat-page";
import SearchPage from "./pages/search-page";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import MyPage from "./pages/my-page";
import AdminProductCreatePage from "./pages/admin-product-create";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/my" element={<MyPage />} />
      <Route path="/admin/products/create" element={<AdminProductCreatePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
