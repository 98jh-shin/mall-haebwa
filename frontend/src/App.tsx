import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { ProductListPage } from './components/ProductListPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { MyPage } from './components/MyPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { AdminPage } from './components/AdminPage';
import { AddProductPage } from './components/AddProductPage';
import { CustomerServicePage } from './components/CustomerServicePage';
import { Toaster } from './components/ui/sonner';

export type Page = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'cart' 
  | 'mypage' 
  | 'login' 
  | 'signup'
  | 'orders'
  | 'admin'
  | 'add-product'
  | 'customer-service';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  address: string;
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
  status: '배송 준비 중' | '배송 중' | '배송 완료';
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
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigateTo = (page: Page, productId?: string) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
  };

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        ci => ci.product.id === item.product.id && 
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
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index].quantity = quantity;
      return newCart;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    navigateTo('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigateTo('home');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage('products');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage('products');
  };

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
        {currentPage === 'home' && (
          <HomePage 
            onNavigate={navigateTo}
            onCategorySelect={handleCategorySelect}
          />
        )}
        
        {currentPage === 'products' && (
          <ProductListPage 
            onNavigate={navigateTo}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        )}
        
        {currentPage === 'product-detail' && selectedProductId && (
          <ProductDetailPage 
            productId={selectedProductId}
            onNavigate={navigateTo}
            onAddToCart={addToCart}
            currentUser={currentUser}
          />
        )}
        
        {currentPage === 'cart' && (
          <CartPage 
            cart={cart}
            onNavigate={navigateTo}
            onUpdateCart={updateCartItem}
            onRemoveFromCart={removeFromCart}
            currentUser={currentUser}
          />
        )}
        
        {currentPage === 'mypage' && (
          <MyPage 
            currentUser={currentUser}
            onNavigate={navigateTo}
            onLogout={handleLogout}
          />
        )}
        
        {currentPage === 'login' && (
          <LoginPage 
            onLogin={handleLogin}
            onNavigate={navigateTo}
          />
        )}
        
        {currentPage === 'signup' && (
          <SignupPage 
            onNavigate={navigateTo}
          />
        )}
        
        {currentPage === 'orders' && (
          <OrderHistoryPage 
            currentUser={currentUser}
            onNavigate={navigateTo}
          />
        )}
        
        {currentPage === 'admin' && (
          <AdminPage 
            onNavigate={navigateTo}
          />
        )}
        
        {currentPage === 'add-product' && (
          <AddProductPage 
            onNavigate={navigateTo}
          />
        )}
        
        {currentPage === 'customer-service' && (
          <CustomerServicePage 
            onNavigate={navigateTo}
          />
        )}
      </main>
      
      <Toaster />
    </div>
  );
}

export default App;