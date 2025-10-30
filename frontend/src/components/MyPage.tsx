import { User, Package, Heart, Star, Settings, LogOut, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import type { Page, User as UserType } from '../App';

interface MyPageProps {
  currentUser: UserType | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function MyPage({ currentUser, onNavigate, onLogout }: MyPageProps) {
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 text-center">
        <User className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h2 className="text-xl mb-4">로그인이 필요합니다</h2>
        <Button
          onClick={() => onNavigate('login')}
          className="bg-gray-900 hover:bg-black text-white"
        >
          로그인하기
        </Button>
      </div>
    );
  }

  const menuItems = [
    {
      icon: Package,
      title: '주문/배송 조회',
      description: '주문 내역 및 배송 상태 확인',
      action: () => onNavigate('orders')
    },
    {
      icon: Heart,
      title: '찜한 상품',
      description: '관심 상품 모아보기',
      action: () => {}
    },
    {
      icon: Star,
      title: '내가 쓴 리뷰',
      description: '작성한 리뷰 관리',
      action: () => {}
    },
    {
      icon: Settings,
      title: '회원정보 수정',
      description: '개인정보 및 설정 변경',
      action: () => {}
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
        <h1 className="text-2xl mb-6">마이페이지</h1>
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 p-6">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="w-16 h-16 mb-3">
                  <AvatarFallback className="bg-gray-900 text-white text-xl">
                    {currentUser.name[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mb-1">{currentUser.name}</h2>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>

              <Separator className="my-4" />

              <div className="space-y-1 text-sm">
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                  onClick={() => onNavigate('orders')}
                >
                  <Package className="w-4 h-4 mr-2" />
                  주문내역
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  찜한 상품
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                >
                  <Star className="w-4 h-4 mr-2" />
                  내 리뷰
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  설정
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  className="w-full justify-start h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 p-4 text-center">
                <p className="text-gray-600 text-xs mb-1">진행 중인 주문</p>
                <p className="text-xl text-gray-900">2</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 text-center">
                <p className="text-gray-600 text-xs mb-1">배송 완료</p>
                <p className="text-xl">8</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 text-center">
                <p className="text-gray-600 text-xs mb-1">찜한 상품</p>
                <p className="text-xl">15</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 text-center">
                <p className="text-gray-600 text-xs mb-1">작성한 리뷰</p>
                <p className="text-xl">6</p>
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 p-5 cursor-pointer hover:border-gray-900 transition-colors"
                  onClick={item.action}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-900/10 rounded-full flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="text-sm mb-0.5">{item.title}</h3>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* User Info */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="mb-4">회원 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">이름</span>
                  <span>{currentUser.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">이메일</span>
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">휴대폰</span>
                  <span>{currentUser.phone}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">기본 배송지</span>
                  <span className="text-right">{currentUser.address}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1 h-9 text-sm">
                  정보 수정
                </Button>
                <Button variant="outline" className="flex-1 h-9 text-sm">
                  비밀번호 변경
                </Button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white border border-gray-200 p-6 mt-6">
              <h3 className="mb-4">계정 관리</h3>
              <div className="space-y-2 text-sm">
                <Button variant="outline" className="w-full justify-between h-9">
                  알림 설정
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between h-9">
                  결제 수단 관리
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between h-9">
                  배송지 관리
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Separator className="my-2" />
                <Button variant="ghost" className="w-full justify-between text-gray-600 h-9">
                  회원 탈퇴
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}