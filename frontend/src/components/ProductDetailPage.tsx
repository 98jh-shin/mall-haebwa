import { useEffect, useState } from "react";
import {
  Star,
  Truck,
  Shield,
  RotateCcw,
  Plus,
  Minus,
  Heart,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import type { Page, CartItem, User, Review, Product } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: Page) => void;
  onAddToCart: (item: CartItem) => void;
  currentUser: User | null;
}

// 백엔드 상품 스키마에 맞춘 타입
interface DetailProduct {
  id: string;
  title: string;
  link?: string;
  image?: string;
  lprice?: string;
  mallName?: string;
  maker?: string;
  brand?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  productid?: string;
  description?: string;
}

export function ProductDetailPage({
  productId,
  onNavigate,
  onAddToCart,
  currentUser,
}: ProductDetailPageProps) {
  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // ✅ 상품 정보 불러오기
  useEffect(() => {
    fetch(`http://localhost:8000/admin/public/products/${productId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.detail || "상품 정보 요청 실패");
        }
        return res.json();
      })
      .then((data: DetailProduct) => setProduct(data))
      .catch((e) =>
        toast.error(e.message || "상품 정보를 불러오지 못했습니다.")
      );
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartProduct: Product = {
      id: product.id,
      name: product.title,
      price: Number(product.lprice || 0),
      originalPrice: undefined,
      image: product.image || "/placeholder.png",
      category: product.category1 || "",
      brand: product.brand || "",
      rating: 0,
      reviewCount: 0,
      description: product.description || "",
      images: [],
      colors: [],
      sizes: [],
      stock: 999,
    };

    onAddToCart({
      product: cartProduct,
      quantity,
      selectedColor: "",
      selectedSize: "",
    });
    toast.success("장바구니에 담았습니다!", {
      action: { label: "장바구니 보기", onClick: () => onNavigate("cart") },
    });
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      toast.error("로그인이 필요합니다.");
      onNavigate("login");
      return;
    }
    handleAddToCart();
    onNavigate("cart");
  };

  if (!product)
    return (
      <div className="text-center py-20 text-gray-500">
        상품 정보를 불러오는 중입니다...
      </div>
    );

  return (
    <div className="bg-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
        {/* 🧭 Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <button
            onClick={() => onNavigate("home")}
            className="hover:text-gray-900">
            홈
          </button>
          <span>›</span>
          <button
            onClick={() => onNavigate("products")}
            className="hover:text-gray-900">
            {product.category1}
          </button>
          <span>›</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        {/* 🖼️ 상품 이미지 + 정보 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="aspect-square bg-gray-50 border border-gray-200 overflow-hidden mb-3">
              <ImageWithFallback
                src={product.image || "/placeholder.png"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
              <h1 className="text-2xl mb-3">{product.title}</h1>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
                <span className="text-sm text-gray-400">리뷰 123</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              {/* <div className="flex items-baseline gap-2 mb-2">
                <Badge className="bg-red-500 text-white border-0">10%</Badge>
              </div> */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">
                  {Number(product.lprice).toLocaleString("ko-KR")}원
                </span>
              </div>
            </div>

            {/* 수량 */}
            <div className="mb-6">
              <h3 className="text-sm mb-3">수량</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-sm">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => setQuantity(quantity + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 총 금액 */}
            <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm">총 상품 금액</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl">
                    {(Number(product.lprice || 0) * quantity).toLocaleString()}
                  </span>
                  <span>원</span>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 mb-6">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12"
                onClick={() => setIsLiked(!isLiked)}>
                <Heart
                  className={`w-5 h-5 ${
                    isLiked ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-white text-gray-900 border border-gray-300 hover:bg-gray-50">
                장바구니
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 h-12 bg-gray-900 hover:bg-black text-white">
                구매하기
              </Button>
            </div>

            {/* 혜택 */}
            <div className="border-t border-gray-200 pt-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <Truck className="w-4 h-4 text-gray-400" />
                <span>무료배송 (3만원 이상 구매 시)</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-gray-400" />
                <span>100% 정품 보증</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-4 h-4 text-gray-400" />
                <span>7일 이내 무료 반품/교환</span>
              </div>
            </div>
          </div>
        </div>

        {/* 상세탭 */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger
              value="description"
              className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm px-6">
              상세정보
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm px-6">
              리뷰
            </TabsTrigger>
            <TabsTrigger
              value="qna"
              className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm px-6">
              Q&A
            </TabsTrigger>
            <TabsTrigger
              value="exchange"
              className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm px-6">
              교환/반품
            </TabsTrigger>
          </TabsList>

          {/* 상세정보 */}
          <TabsContent value="description" className="mt-6">
            <Card className="p-8">
              <h2 className="text-lg mb-4">상품 상세정보</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                {product.brand}의 인기 상품입니다. 네이버 쇼핑 최저가 기준
                데이터를 사용합니다.
              </p>
              <ImageWithFallback
                src={product.image}
                alt={product.title}
                className="w-full h-96 object-cover border border-gray-200 rounded"
              />
            </Card>
          </TabsContent>

          {/* 리뷰 */}
          <TabsContent value="reviews" className="mt-6">
            <Card className="p-8 text-center text-gray-500">
              아직 등록된 리뷰가 없습니다.
            </Card>
          </TabsContent>

          {/* Q&A */}
          <TabsContent value="qna" className="mt-6">
            <Card className="p-8 text-center text-gray-500">
              아직 등록된 문의가 없습니다.
            </Card>
          </TabsContent>

          {/* 교환/반품 */}
          <TabsContent value="exchange" className="mt-6">
            <Card className="p-8">
              <h3 className="text-lg mb-4">교환 및 반품 안내</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                단순 변심의 경우 왕복 배송비(6,000원)는 고객 부담입니다. 상품
                하자 또는 오배송의 경우 판매자가 부담합니다.
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
