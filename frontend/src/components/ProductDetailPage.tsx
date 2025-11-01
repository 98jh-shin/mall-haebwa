import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  Star,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useAppState } from "../context/app-state";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const productCatalog = [
  {
    id: "1",
    name: "여름 린넨 반팔 셔츠",
    price: 29900,
    originalPrice: 45000,
    category: "패션의류",
    brand: "베이직코드",
    rating: 4.8,
    reviewCount: 1234,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    ],
    colors: ["화이트", "블랙", "라이트블루", "베이지"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "시원한 린넨 소재로 제작된 여름 셔츠입니다. 하루 종일 편안하게 착용할 수 있으며 포멀한 자리에서도 잘 어울립니다.",
    stock: 150,
  },
  {
    id: "2",
    name: "프리미엄 요가 매트",
    price: 39900,
    category: "스포츠/레저",
    brand: "핏플랜",
    rating: 4.7,
    reviewCount: 678,
    images: [
      "https://images.unsplash.com/photo-1593810450967-f9c42742e326?w=800&q=80",
    ],
    colors: ["퍼플", "핑크", "그레이"],
    sizes: ["기본"],
    description:
      "두께 10mm의 프리미엄 요가 매트로, 쿠션감이 뛰어나고 미끄럼 방지 처리가 되어 안정적인 운동이 가능합니다.",
    stock: 250,
  },
];

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { productId = "1" } = useParams();
  const { addToCart, currentUser } = useAppState();
  const product = useMemo(
    () => productCatalog.find((item) => item.id === productId) ?? productCatalog[0],
    [productId],
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] ?? "기본",
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] ?? "기본",
  );
  const [activeImage, setActiveImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      selectedColor,
      selectedSize,
    });
    toast.success("장바구니에 상품이 추가되었습니다.", {
      action: {
        label: "장바구니 보기",
        onClick: () => navigate("/cart"),
      },
    });
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      toast.error("로그인 후 구매하실 수 있습니다.");
      navigate("/login");
      return;
    }
    handleAddToCart();
    navigate("/cart");
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1100px] px-6 py-8 md:px-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <button type="button" onClick={() => navigate("/")}>
            홈
          </button>
          <span>/</span>
          <button type="button" onClick={() => navigate("/products")}>
            {product.category}
          </button>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="overflow-hidden border border-gray-200">
              <ImageWithFallback
                src={product.images?.[activeImage] ?? ""}
                alt={product.name}
                className="h-[420px] w-full object-cover"
              />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images?.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`border ${activeImage === index ? "border-gray-900" : "border-gray-200"}`}
                >
                  <ImageWithFallback
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-20 w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <Card className="space-y-6 border-gray-200 p-6">
            <div className="space-y-3">
              <Badge className="bg-gray-100 text-gray-700">{product.brand}</Badge>
              <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="h-4 w-4 fill-gray-900 text-gray-900" />
                <span>{product.rating}</span>
                <span className="text-gray-400">({product.reviewCount.toLocaleString()} reviews)</span>
              </div>
            </div>

            <div>
              <p className="text-3xl font-semibold text-gray-900">
                ₩{product.price.toLocaleString()}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-gray-500 line-through">
                  ₩{product.originalPrice.toLocaleString()}
                </p>
              )}
            </div>

            {product.colors && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">컬러</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <Button
                      key={color}
                      type="button"
                      variant={selectedColor === color ? "default" : "outline"}
                      onClick={() => setSelectedColor(color)}
                      className="h-9"
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">사이즈</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Button
                      key={size}
                      type="button"
                      variant={selectedSize === size ? "default" : "outline"}
                      onClick={() => setSelectedSize(size)}
                      className="h-9"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded border border-gray-200">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setWishlist((prev) => !prev)}
                className="gap-2"
              >
                <Heart className={`h-4 w-4 ${wishlist ? "fill-gray-900 text-gray-900" : ""}`} />
                찜하기
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info("공유 기능은 준비 중입니다.")}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                공유
              </Button>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                className="h-11 w-full bg-gray-900 text-white hover:bg-black"
                onClick={handleAddToCart}
              >
                장바구니에 담기
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full"
                onClick={handleBuyNow}
              >
                바로 구매하기
              </Button>
            </div>

            <div className="grid gap-3 rounded border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-400" />
                <span>무료 배송 (₩30,000 이상 구매 시)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span>Mall 해봐 보증으로 안심하고 구매하세요.</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-gray-400" />
                <span>수령 후 7일 이내 무료 반품 가능합니다.</span>
              </div>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="description" className="mt-10">
          <TabsList>
            <TabsTrigger value="description">상세 정보</TabsTrigger>
            <TabsTrigger value="reviews">리뷰</TabsTrigger>
            <TabsTrigger value="shipping">배송/반품 안내</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6 space-y-4 text-sm text-gray-600">
            <p>{product.description}</p>
            <p>
              린넨과 코튼 혼방 소재로 제작되어 구김이 적고 가볍습니다. 세탁 시 손세탁 또는 드라이클리닝을 권장합니다.
            </p>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card className="border-gray-200 p-6 text-sm text-gray-600">
              리뷰 기능은 준비 중입니다. 구매 후 리뷰를 작성해 주세요!
            </Card>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6 text-sm text-gray-600">
            <Card className="space-y-3 border-gray-200 p-6">
              <p>오후 2시 이전 결제 시 당일 출고됩니다.</p>
              <Separator />
              <p>제주 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
