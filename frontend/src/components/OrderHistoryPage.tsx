import { ChevronRight, Package, RotateCcw, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppState } from "../context/app-state";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const orders = [
  {
    id: "ORD-20250101-0001",
    date: "2025-01-01",
    status: "배송 완료",
    total: 59800,
    items: [
      {
        name: "여름 린넨 반팔 셔츠",
        quantity: 2,
        price: 29900,
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&q=80",
      },
    ],
  },
  {
    id: "ORD-20241224-0007",
    date: "2024-12-24",
    status: "배송 중",
    total: 89000,
    items: [
      {
        name: "프리미엄 요가 매트",
        quantity: 1,
        price: 39900,
        image:
          "https://images.unsplash.com/photo-1593810450967-f9c42742e326?w=200&q=80",
      },
      {
        name: "민감성 보습 크림",
        quantity: 1,
        price: 24900,
        image:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80",
      },
    ],
  },
];

export function OrderHistoryPage() {
  const navigate = useNavigate();
  const { currentUser } = useAppState();

  if (!currentUser) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <Package className="h-16 w-16 text-gray-300" />
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            주문 내역을 확인하려면 로그인하세요
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            주문 상태와 배송 정보를 한 번에 확인할 수 있습니다.
          </p>
        </div>
        <Button
          className="h-11 px-8 bg-gray-900 text-white hover:bg-black"
          onClick={() => navigate("/login")}
        >
          로그인하기
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1100px] px-6 py-10 md:px-8">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">주문/배송 조회</h1>
            <p className="text-sm text-gray-600">
              최근 주문 내역과 배송 현황을 확인하세요.
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 text-sm"
            onClick={() => toast.info("택배사 연동은 준비 중입니다.")}
          >
            <Truck className="h-4 w-4" />
            운송장 조회
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="shipping">배송 중</TabsTrigger>
            <TabsTrigger value="completed">배송 완료</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="space-y-4 border-gray-200 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500">주문번호</p>
                    <p className="font-mono text-sm text-gray-800">{order.id}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RotateCcw className="h-4 w-4" />
                    {order.date}
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-600">
                    {order.status}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.name}`}
                      className="flex gap-4 border border-gray-100 p-4"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            수량 {item.quantity}개
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-gray-900">
                            ₩{(item.price * item.quantity).toLocaleString()}
                          </p>
                          <Button
                            variant="ghost"
                            className="gap-1 text-xs text-gray-500"
                            onClick={() => toast.info("교환/반품 기능은 준비 중입니다.")}
                          >
                            교환/반품 신청
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div className="text-gray-500">
                    총 결제 금액{" "}
                    <span className="font-semibold text-gray-900">
                      ₩{order.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/customer-service")}
                    >
                      문의하기
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gray-900 text-white hover:bg-black"
                      onClick={() => toast.success("리뷰 작성 페이지로 이동합니다.")}
                    >
                      리뷰 작성
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="shipping">
            <Card className="border-gray-200 p-6 text-sm text-gray-600">
              배송 중인 주문은 곧 도착 예정입니다. 운송장 조회 메뉴에서 배송 상황을 확인해 보세요.
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card className="border-gray-200 p-6 text-sm text-gray-600">
              완료된 주문이 없습니다. 최근 주문 내역은 전체 탭에서 확인하세요.
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
