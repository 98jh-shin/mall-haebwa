import { useState } from 'react';
import { Search, ShoppingCart, User, Menu, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import type { User as UserType, Page } from '../App';

interface HeaderProps {
  currentUser: UserType | null;
  cartItemCount: number;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

const categories = [
  '패션의류', '뷰티', '식품', '생활/주방', '가전디지털', '스포츠/레저', '출산/육아', '도서'
];

export function Header({ currentUser, cartItemCount, onNavigate, onLogout, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-1.5">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI 자연어 검색으로 원하는 상품을 쉽게 찾아보세요!</span>
            <span className="md:hidden">AI 검색 사용해보세요</span>
          </div>
          <div className="hidden md:flex gap-4 text-xs">
            <button 
              className="hover:underline"
              onClick={() => onNavigate('customer-service')}
            >
              고객센터
            </button>
            <button 
              className="hover:underline"
              onClick={() => onNavigate('admin')}
            >
              판매자센터
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <button 
              onClick={() => onNavigate('home')}
              className="shrink-0"
            >
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5">
                  <span className="text-gray-900 text-xl" style={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                    MALL<span className="text-gray-600">해봐</span>
                  </span>
                </div>
              </div>
            </button>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-[600px]">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="AI 자연어 검색: '여름 시원한 옷', '출근용 신발' 등"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-24 h-12 border-2 border-gray-900 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="absolute right-[52px] top-1/2 -translate-y-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs mx-[10px] my-[0px]">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI
                  </Badge>
                </div>
                <Button 
                  type="submit"
                  className="absolute right-0 top-0 h-12 w-12 bg-gray-900 hover:bg-black text-white rounded-l-none rounded-r-sm p-0"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </form>

            {/* User Actions */}
            <div className="flex items-center gap-1 ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('cart')}
                className="relative h-9"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center bg-gray-900 text-white text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
              
              {currentUser ? (
                <div className="hidden md:flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('mypage')}
                    className="h-9"
                  >
                    <User className="w-4 h-4 mr-1" />
                    <span className="text-sm">{currentUser.name}</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate('login')}
                  className="hidden md:flex h-9 text-sm"
                >
                  로그인
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-9"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-100 hidden md:block">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="flex items-center gap-6 text-sm py-3">
            <div 
              className="relative"
              onMouseEnter={() => setShowCategoryDropdown(true)}
              onMouseLeave={() => setShowCategoryDropdown(false)}
            >
              <button 
                onClick={() => onNavigate('products')}
                className="hover:text-gray-900 transition-all whitespace-nowrap cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
              >
                전체 카테고리
              </button>
              
              {/* Dropdown Menu */}
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 pt-3 z-50">
                  <div className="bg-white border border-gray-200 rounded-sm shadow-lg py-2 min-w-[180px]">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          onNavigate('products');
                          setShowCategoryDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onNavigate('products')}
                className="hover:text-gray-900 transition-all whitespace-nowrap cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gray-900 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-6 md:px-8 py-3">
            {currentUser ? (
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onNavigate('mypage');
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  마이페이지
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onLogout();
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start text-sm"
                >
                  로그아웃
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => {
                  onNavigate('login');
                  setShowMobileMenu(false);
                }}
                className="w-full bg-gray-900 hover:bg-black text-white text-sm"
              >
                로그인
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}