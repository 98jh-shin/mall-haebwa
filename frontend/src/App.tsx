import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { ProductListPage } from "./components/ProductListPage";
import { ProductDetailPage } from "./components/ProductDetailPage";
import { CartPage } from "./components/CartPage";
import { MyPage } from "./components/MyPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { OrderHistoryPage } from "./components/OrderHistoryPage";
import { AdminPage } from "./components/AdminPage";
import { AddProductPage } from "./components/AddProductPage";
import { CustomerServicePage } from "./components/CustomerServicePage";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export type Page =
  | "home"
  | "products"
  | "product-detail"
  | "cart"
  | "mypage"
  | "login"
  | "signup"
  | "orders"
  | "admin"
  | "add-product"
  | "customer-service";

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  role?: "user" | "admin";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  description: string;
  images: string[];
  colors?: string[];
  sizes?: string[];
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "배송 준비 중" | "배송 중" | "배송 완료";
  address: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  images?: string[];
  date: string;
  helpful: number;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const navigateTo = (page: Page, productId?: string) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (ci) =>
          ci.product.id === item.product.id &&
          ci.selectedColor === item.selectedColor &&
          ci.selectedSize === item.selectedSize
      );

      if (existingIndex >= 0) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += item.quantity;
        return newCart;
      }

      return [...prevCart, item];
    });
  };

  const updateCartItem = (index: number, quantity: number) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      newCart[index].quantity = quantity;
      return newCart;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    navigateTo("home");
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("로그아웃 완료!");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.detail ?? "로그아웃 실패");
      }
    } catch (err) {
      toast.error("서버 연결 실패");
    } finally {
      setCurrentUser(null);
      navigateTo("home");
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage("products");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage("products");
  };
  // ✅ 자동 로그인 유지 기능
  useEffect(() => {
    const checkLogin = async () => {
      try {
        // 1️⃣ 먼저 access_token으로 로그인 확인
        const res = await fetch("http://localhost:8000/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const user = await res.json();
          setCurrentUser({
            id: user.id ?? user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            address: user.address,
            role: user.role ?? "user",
          });
          return;
        }

        // 2️⃣ access_token 만료 시 refresh 시도
        const refreshRes = await fetch("http://localhost:8000/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        if (refreshRes.ok) {
          // 새 access 발급 성공 → 다시 내 정보 가져오기
          const meRes = await fetch("http://localhost:8000/auth/me", {
            credentials: "include",
          });
          if (meRes.ok) {
            const user = await meRes.json();
            setCurrentUser({
              id: user.id ?? user._id,
              email: user.email,
              name: user.name,
              phone: user.phone,
              address: user.address,
              role: user.role ?? "user",
            });
          }
        }
      } catch (err) {
        console.warn("자동 로그인 확인 실패:", err);
      }
    };

    checkLogin();
  }, []);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-white">
      <Header
        currentUser={currentUser}
        cartItemCount={cart.length}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        onSearch={handleSearch}
      />

      <main>
        {currentPage === "home" && (
          <HomePage
            onNavigate={navigateTo}
            onCategorySelect={handleCategorySelect}
          />
        )}

        {currentPage === "products" && (
          <ProductListPage
            onNavigate={navigateTo}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        )}

        {currentPage === "product-detail" && selectedProductId && (
          <ProductDetailPage
            productId={selectedProductId}
            onNavigate={navigateTo}
            onAddToCart={addToCart}
            currentUser={currentUser}
          />
        )}

        {currentPage === "cart" && (
          <CartPage
            cart={cart}
            onNavigate={navigateTo}
            onUpdateCart={updateCartItem}
            onRemoveFromCart={removeFromCart}
            currentUser={currentUser}
          />
        )}

        {currentPage === "mypage" && (
          <MyPage
            currentUser={currentUser}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        )}

        {currentPage === "login" && (
          <LoginPage onLogin={handleLogin} onNavigate={navigateTo} />
        )}

        {currentPage === "signup" && <SignupPage onNavigate={navigateTo} />}

        {currentPage === "orders" && (
          <OrderHistoryPage currentUser={currentUser} onNavigate={navigateTo} />
        )}

        {currentPage === "admin" &&
          (currentUser?.role === "admin" ? (
            <AdminPage onNavigate={navigateTo} />
          ) : (
            <div className="p-8 text-center text-red-500 font-semibold">
              ⚠️ 관리자만 접근할 수 있는 페이지입니다.
            </div>
          ))}

        {currentPage === "add-product" && (
          <AddProductPage onNavigate={navigateTo} />
        )}

        {currentPage === "customer-service" && (
          <CustomerServicePage onNavigate={navigateTo} />
        )}
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "linear-gradient(90deg, #9C27B0, #E91E63)",
            color: "white",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />
    </div>
  );
}

export default App;
