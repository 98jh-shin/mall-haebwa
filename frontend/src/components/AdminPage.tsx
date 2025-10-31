import { useState, useEffect } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  Tag,
  TrendingUp,
  BarChart3,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import type { Page, Product, Order } from "../App";

interface AdminPageProps {
  onNavigate: (page: Page) => void;
}

// Mock data
const mockProducts: Product[] = [
  {
    id: "1",
    name: "여름 시원한 린넨 반팔 셔츠",
    price: 29900,
    originalPrice: 45000,
    image: "fashion shirt",
    category: "fashion",
    brand: "베이직코튼",
    rating: 4.8,
    reviewCount: 1234,
    description: "시원한 린넨 소재",
    images: [],
    colors: ["화이트", "블랙", "네이비"],
    sizes: ["S", "M", "L", "XL"],
    stock: 150,
  },
  {
    id: "2",
    name: "편안한 운동화 데일리 스니커즈",
    price: 49900,
    originalPrice: 79000,
    image: "casual sneakers",
    category: "fashion",
    brand: "워크앤런",
    rating: 4.9,
    reviewCount: 2341,
    description: "편안한 스니커즈",
    images: [],
    colors: ["화이트", "블랙"],
    sizes: ["230", "240", "250", "260", "270"],
    stock: 200,
  },
];

const mockOrders: Order[] = [
  {
    id: "ORD-20251028-001",
    date: "2025-10-28",
    items: [
      {
        product: mockProducts[0],
        quantity: 2,
        selectedColor: "화이트",
        selectedSize: "L",
      },
    ],
    total: 59800,
    status: "배송 중",
    address: "서울시 강남구 테헤란로 123",
  },
];

const mockCustomers = [
  {
    id: "1",
    name: "홍길동",
    email: "hong@example.com",
    grade: "VIP",
    orders: 15,
    totalSpent: 1500000,
  },
  {
    id: "2",
    name: "김철수",
    email: "kim@example.com",
    grade: "일반",
    orders: 3,
    totalSpent: 250000,
  },
  {
    id: "3",
    name: "이영희",
    email: "lee@example.com",
    grade: "신규",
    orders: 1,
    totalSpent: 89000,
  },
];

const mockCoupons = [
  {
    id: "1",
    code: "WELCOME10",
    discount: 10,
    type: "퍼센트",
    active: true,
    used: 45,
  },
  {
    id: "2",
    code: "SUMMER2025",
    discount: 5000,
    type: "금액",
    active: true,
    used: 123,
  },
];

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [selectedTab, setSelectedTab] = useState("dashboard");

  useEffect(() => {
    fetch("http://localhost:8000/admin/check", {
      credentials: "include",
    }).then((res) => {
      if (res.status === 403) {
        toast.error("관리자 권한이 없습니다!");
        onNavigate("home");
      }
    });
  }, []);

  // Dashboard stats
  const stats = {
    todaySales: 2450000,
    monthSales: 45670000,
    totalOrders: 342,
    newCustomers: 28,
    totalProducts: 156,
    lowStock: 12,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl mb-1">셀러 센터</h1>
            <p className="text-sm text-gray-600">
              상품과 주문을 관리하고 매출을 분석하세요
            </p>
          </div>
          <Button variant="outline" onClick={() => onNavigate("home")}>
            쇼핑몰로 돌아가기
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6 bg-white border">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              대시보드
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-2">
              <Package className="w-4 h-4" />
              상품 관리
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              주문/배송
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-2">
              <Users className="w-4 h-4" />
              회원 관리
            </TabsTrigger>
            <TabsTrigger value="promotions" className="gap-2">
              <Tag className="w-4 h-4" />
              쿠폰/프로모션
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Card className="p-4">
                <p className="text-xs text-gray-600 mb-1">오늘 매출</p>
                <p className="text-xl text-gray-900">
                  {stats.todaySales.toLocaleString()}원
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-gray-600 mb-1">이번 달 매출</p>
                <p className="text-xl text-gray-900">
                  {stats.monthSales.toLocaleString()}원
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-gray-600 mb-1">총 주문</p>
                <p className="text-xl text-gray-900">{stats.totalOrders}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-gray-600 mb-1">신규 고객</p>
                <p className="text-xl text-gray-900">{stats.newCustomers}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-gray-600 mb-1">전체 상품</p>
                <p className="text-xl text-gray-900">{stats.totalProducts}</p>
              </Card>
              <Card className="p-4">
                <p className="text-xs text-gray-600 mb-1">재고 부족</p>
                <p className="text-xl text-red-600">{stats.lowStock}</p>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Sales Chart */}
              <Card className="p-6">
                <h3 className="mb-4">주간 매출 추이</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {["월", "화", "수", "목", "금", "토", "일"].map((day, i) => (
                    <div
                      key={day}
                      className="flex-1 flex flex-col items-center gap-2">
                      <div
                        className="w-full bg-gray-900 rounded-t"
                        style={{ height: `${(i + 1) * 30}px` }}></div>
                      <span className="text-xs text-gray-600">{day}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Products */}
              <Card className="p-6">
                <h3 className="mb-4">인기 상품 Top 5</h3>
                <div className="space-y-3">
                  {mockProducts.slice(0, 2).map((product, i) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 pb-3 border-b">
                      <span className="text-sm w-6">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm mb-1">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          판매량: {product.reviewCount}
                        </p>
                      </div>
                      <span className="text-sm">
                        {product.price.toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6">
              <h3 className="mb-4">최근 주문</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>날짜</TableHead>
                    <TableHead>상품</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="text-sm">{order.id}</TableCell>
                      <TableCell className="text-sm">{order.date}</TableCell>
                      <TableCell className="text-sm">
                        {order.items[0].product.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.total.toLocaleString()}원
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input placeholder="상품 검색..." className="pl-10 w-80" />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 카테고리</SelectItem>
                      <SelectItem value="fashion">패션의류</SelectItem>
                      <SelectItem value="beauty">뷰티</SelectItem>
                      <SelectItem value="digital">가전디지털</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="bg-gray-900 hover:bg-black text-white gap-2"
                  onClick={() => onNavigate("add-product")}>
                  <Plus className="w-4 h-4" />
                  상품 등록
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이미지</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>가격</TableHead>
                    <TableHead>재고</TableHead>
                    <TableHead>판매량</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="w-12 h-12 bg-gray-100 rounded"></div>
                      </TableCell>
                      <TableCell className="text-sm">{product.name}</TableCell>
                      <TableCell className="text-sm">
                        {product.category}
                      </TableCell>
                      <TableCell className="text-sm">
                        {product.price.toLocaleString()}원
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            product.stock < 50
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }>
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {product.reviewCount}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          판매중
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Input placeholder="주문번호 검색..." className="w-64" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 상태</SelectItem>
                      <SelectItem value="preparing">배송 준비 중</SelectItem>
                      <SelectItem value="shipping">배송 중</SelectItem>
                      <SelectItem value="delivered">배송 완료</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>주문일시</TableHead>
                    <TableHead>고객명</TableHead>
                    <TableHead>상품</TableHead>
                    <TableHead>결제금액</TableHead>
                    <TableHead>배송상태</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="text-sm">{order.id}</TableCell>
                      <TableCell className="text-sm">{order.date}</TableCell>
                      <TableCell className="text-sm">홍길동</TableCell>
                      <TableCell className="text-sm">
                        {order.items[0].product.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.total.toLocaleString()}원
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={order.status}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="배송 준비 중">
                              배송 준비 중
                            </SelectItem>
                            <SelectItem value="배송 중">배송 중</SelectItem>
                            <SelectItem value="배송 완료">배송 완료</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs">
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Input placeholder="회원 검색..." className="w-64" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 등급</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                      <SelectItem value="regular">일반</SelectItem>
                      <SelectItem value="new">신규</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>회원명</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>등급</TableHead>
                    <TableHead>총 주문</TableHead>
                    <TableHead>총 구매액</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="text-sm">{customer.name}</TableCell>
                      <TableCell className="text-sm">
                        {customer.email}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            customer.grade === "VIP"
                              ? "bg-yellow-100 text-yellow-700"
                              : customer.grade === "신규"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }>
                          {customer.grade}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {customer.orders}회
                      </TableCell>
                      <TableCell className="text-sm">
                        {customer.totalSpent.toLocaleString()}원
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs">
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Coupons */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>쿠폰 관리</h3>
                  <Button className="bg-gray-900 hover:bg-black text-white h-9 text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    쿠폰 생성
                  </Button>
                </div>
                <div className="space-y-3">
                  {mockCoupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="border border-gray-200 p-4 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm">{coupon.code}</span>
                        <Badge
                          className={
                            coupon.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }>
                          {coupon.active ? "활성" : "비활성"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                          {coupon.discount}
                          {coupon.type === "퍼센트" ? "%" : "원"} 할인
                        </span>
                        <span>사용: {coupon.used}회</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Banners */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3>배너 관리</h3>
                  <Button className="bg-gray-900 hover:bg-black text-white h-9 text-sm">
                    <Plus className="w-4 h-4 mr-1" />
                    배너 등록
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="border border-gray-200 p-4 rounded">
                    <div className="w-full h-24 bg-gray-100 rounded mb-3"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm mb-1">여름 세일 배너</p>
                        <p className="text-xs text-gray-500">메인 페이지</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
