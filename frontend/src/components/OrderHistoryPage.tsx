import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import type { Page, User, Order } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface OrderHistoryPageProps {
  currentUser: User | null;
  onNavigate: (page: Page) => void;
}

const mockOrders: Order[] = [
  {
    id: "ORD-20251028-001",
    date: "2025-10-28",
    items: [
      {
        product: {
          id: "1",
          name: "여름 시원한 린넨 반팔 셔츠",
          price: 29900,
          image: "fashion shirt",
          category: "fashion",
          brand: "베이직코튼",
          rating: 4.8,
          reviewCount: 1234,
          description: "시원한 린넨 소재",
          images: [],
          stock: 150,
        },
        quantity: 2,
        selectedColor: "화이트",
        selectedSize: "L",
      },
    ],
    total: 59800,
    status: "배송 중",
    address: "서울시 강남구 테헤란로 123",
  },
  {
    id: "ORD-20251025-002",
    date: "2025-10-25",
    items: [
      {
        product: {
          id: "2",
          name: "편안한 운동화 데일리 스니커즈",
          price: 49900,
          image: "casual sneakers",
          category: "fashion",
          brand: "워크앤런",
          rating: 4.9,
          reviewCount: 2341,
          description: "편안한 스니커즈",
          images: [],
          stock: 200,
        },
        quantity: 1,
        selectedColor: "블랙",
        selectedSize: "260",
      },
    ],
    total: 49900,
    status: "배송 완료",
    address: "서울시 강남구 테헤란로 123",
  },
  {
    id: "ORD-20251020-003",
    date: "2025-10-20",
    items: [
      {
        product: {
          id: "3",
          name: "무선 블루투스 이어폰 프리미엄",
          price: 89000,
          image: "wireless earbuds",
          category: "digital",
          brand: "사운드프로",
          rating: 4.7,
          reviewCount: 892,
          description: "프리미엄 이어폰",
          images: [],
          stock: 80,
        },
        quantity: 1,
      },
    ],
    total: 89000,
    status: "배송 완료",
    address: "서울시 강남구 테헤란로 123",
  },
  {
    id: "ORD-20251015-004",
    date: "2025-10-15",
    items: [
      {
        product: {
          id: "4",
          name: "천연 보습 크림 대용량",
          price: 24900,
          image: "skincare cream",
          category: "beauty",
          brand: "네이처스킨",
          rating: 4.6,
          reviewCount: 567,
          description: "천연 보습 크림",
          images: [],
          stock: 300,
        },
        quantity: 3,
      },
    ],
    total: 74700,
    status: "배송 준비 중",
    address: "서울시 강남구 테헤란로 123",
  },
];

export function OrderHistoryPage({
  currentUser,
  onNavigate,
}: OrderHistoryPageProps) {
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 text-center">
        <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl mb-4">로그인이 필요합니다</h2>
        <Button
          onClick={() => onNavigate("login")}
          className="bg-gray-900 hover:bg-black text-white">
          로그인하기
        </Button>
      </div>
    );
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "배송 준비 중":
        return <Package className="w-5 h-5" />;
      case "배송 중":
        return <Truck className="w-5 h-5" />;
      case "배송 완료":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "배송 준비 중":
        return "bg-gray-100 text-gray-700";
      case "배송 중":
        return "bg-blue-100 text-blue-700";
      case "배송 완료":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filterOrders = (status?: Order["status"]) => {
    if (!status) return mockOrders;
    return mockOrders.filter((order) => order.status === status);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <div className="bg-white border border-gray-200 p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">{order.date}</p>
          <p className="text-sm">주문번호: {order.id}</p>
        </div>
        <Badge
          className={`${getStatusColor(
            order.status
          )} flex items-center gap-1 text-xs`}>
          {getStatusIcon(order.status)}
          {order.status}
        </Badge>
      </div>

      <Separator className="mb-4" />

      {order.items.map((item, index) => (
        <div key={index} className="flex gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-sm mb-1">{item.product.name}</h3>
            <p className="text-xs text-gray-500 mb-1">
              {item.selectedColor && `색상: ${item.selectedColor}`}
              {item.selectedColor && item.selectedSize && " / "}
              {item.selectedSize && `사이즈: ${item.selectedSize}`}
            </p>
            <p className="text-xs text-gray-500">수량: {item.quantity}개</p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              {(item.product.price * item.quantity).toLocaleString()}원
            </p>
          </div>
        </div>
      ))}

      <Separator className="mb-4" />

      <div className="flex items-center justify-between mb-4 text-sm">
        <span className="text-gray-600">총 결제금액</span>
        <span className="text-lg">{order.total.toLocaleString()}원</span>
      </div>

      <div className="flex gap-2">
        {order.status === "배송 중" && (
          <Button variant="outline" size="sm" className="flex-1 h-9 text-xs">
            <Truck className="w-3 h-3 mr-1" />
            배송 조회
          </Button>
        )}
        {order.status === "배송 완료" && (
          <>
            <Button variant="outline" size="sm" className="flex-1 h-9 text-xs">
              <RotateCcw className="w-3 h-3 mr-1" />
              교환/반품
            </Button>
            <Button variant="outline" size="sm" className="flex-1 h-9 text-xs">
              리뷰 작성
            </Button>
          </>
        )}
        <Button variant="outline" size="sm" className="h-9 w-9 p-0">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
        <h1 className="text-2xl mb-6">주문 내역</h1>

        {/* Order Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 p-4 text-center">
            <Package className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">배송 준비 중</p>
            <p className="text-xl text-gray-900">
              {filterOrders("배송 준비 중").length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-4 text-center">
            <Truck className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">배송 중</p>
            <p className="text-xl text-blue-600">
              {filterOrders("배송 중").length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">배송 완료</p>
            <p className="text-xl text-green-600">
              {filterOrders("배송 완료").length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 p-4 text-center">
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <p className="text-xs text-gray-600 mb-1">취소/반품</p>
            <p className="text-xl text-red-600">0</p>
          </div>
        </div>

        {/* Orders List */}
        <Tabs defaultValue="all">
          <TabsList className="mb-6 bg-white border border-gray-200">
            <TabsTrigger value="all" className="text-sm">
              전체 ({mockOrders.length})
            </TabsTrigger>
            <TabsTrigger value="preparing" className="text-sm">
              배송 준비 중 ({filterOrders("배송 준비 중").length})
            </TabsTrigger>
            <TabsTrigger value="shipping" className="text-sm">
              배송 중 ({filterOrders("배송 중").length})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-sm">
              배송 완료 ({filterOrders("배송 완료").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {mockOrders.length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-4">
                  주문 내역이 없습니다
                </p>
                <Button
                  onClick={() => onNavigate("home")}
                  className="bg-gray-900 hover:bg-black text-white h-9 text-sm">
                  쇼핑하러 가기
                </Button>
              </div>
            ) : (
              mockOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>

          <TabsContent value="preparing">
            {filterOrders("배송 준비 중").length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <p className="text-sm text-gray-600">
                  배송 준비 중인 주문이 없습니다
                </p>
              </div>
            ) : (
              filterOrders("배송 준비 중").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>

          <TabsContent value="shipping">
            {filterOrders("배송 중").length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <p className="text-sm text-gray-600">
                  배송 중인 주문이 없습니다
                </p>
              </div>
            ) : (
              filterOrders("배송 중").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>

          <TabsContent value="delivered">
            {filterOrders("배송 완료").length === 0 ? (
              <div className="bg-white border border-gray-200 p-12 text-center">
                <p className="text-sm text-gray-600">
                  배송 완료된 주문이 없습니다
                </p>
              </div>
            ) : (
              filterOrders("배송 완료").map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
