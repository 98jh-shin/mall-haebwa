import { Sparkles, TrendingUp, Star, ChevronRight, Truck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Page } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onNavigate: (page: Page, productId?: string) => void;
  onCategorySelect: (category: string) => void;
}

const mockProducts = [
  {
    id: "1",
    name: "여름 시원한 린넨 반팔 셔츠",
    price: 29900,
    originalPrice: 45000,
    image: "fashion shirt",
    rating: 4.8,
    reviewCount: 1234,
    badge: "베스트",
    delivery: "무료배송",
  },
  {
    id: "2",
    name: "편안한 운동화 데일리 스니커즈",
    price: 49900,
    originalPrice: 79000,
    image: "casual sneakers",
    rating: 4.9,
    reviewCount: 2341,
    badge: "인기",
    delivery: "무료배송",
  },
  {
    id: "3",
    name: "무선 블루투스 이어폰 프리미엄",
    price: 89000,
    originalPrice: 120000,
    image: "wireless earbuds",
    rating: 4.7,
    reviewCount: 892,
    badge: "NEW",
    delivery: "무료배송",
  },
  {
    id: "4",
    name: "천연 보습 크림 대용량",
    price: 24900,
    originalPrice: 35000,
    image: "skincare cream",
    rating: 4.6,
    reviewCount: 567,
    badge: "특가",
    delivery: "무료배송",
  },
  {
    id: "5",
    name: "가볍고 튼튼한 캐리어 20인치",
    price: 89000,
    originalPrice: 150000,
    image: "luggage suitcase",
    rating: 4.8,
    reviewCount: 445,
    badge: "베스트",
    delivery: "무료배송",
  },
  {
    id: "6",
    name: "프리미엄 요가매트 두께 10mm",
    price: 39900,
    originalPrice: 59000,
    image: "yoga mat",
    rating: 4.7,
    reviewCount: 678,
    badge: "인기",
    delivery: "무료배송",
  },
];

export function HomePage({ onNavigate, onCategorySelect }: HomePageProps) {
  return (
    <div className="bg-white">
      {/* AI Search Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-8 md:py-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-6 h-6" />
                <h1 className="text-xl md:text-2xl">AI 자연어 검색</h1>
              </div>
              <p className="text-sm md:text-base mb-3 opacity-90">
                "여름 시원한 옷", "출근용 신발" 같은 자연스러운 말로 검색하세요
              </p>
              <div className="flex gap-2 text-xs">
                <Badge className="bg-white/15 backdrop-blur-sm text-white border-0 text-xs">
                  실시간 AI 분석
                </Badge>
                <Badge className="bg-white/15 backdrop-blur-sm text-white border-0 text-xs">
                  맞춤 추천
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Search Examples */}
      <div className="border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gray-900" />
            <h2 className="text-lg">AI 검색 활용 예시</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 bg-purple-50 border border-purple-100 rounded">
              <p className="text-sm text-gray-600 mb-1">예시:</p>
              <p className="mb-1">"30대 남성 데일리 룩"</p>
              <p className="text-xs text-gray-500">
                → 스타일과 연령대를 고려한 상품 추천
              </p>
            </div>
            <div className="p-4 bg-pink-50 border border-pink-100 rounded">
              <p className="text-sm text-gray-600 mb-1">예시:</p>
              <p className="mb-1">"민감성 피부에 좋은 화장품"</p>
              <p className="text-xs text-gray-500">
                → 피부 타입에 맞는 제품 추천
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Products */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl">베스트 상품</h2>
          <Button
            variant="ghost"
            onClick={() => onCategorySelect("all")}
            className="text-sm text-gray-600 hover:text-gray-900">
            전체보기
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer group"
              onClick={() => onNavigate("product-detail", product.id)}>
              <div className="relative aspect-square bg-gray-50 mb-2 overflow-hidden">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-xs">
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100
                    )}
                    %
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm mb-1 line-clamp-2 h-10">{product.name}</p>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-lg">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-sm">원</span>
                </div>
                {product.originalPrice && (
                  <p className="text-xs text-gray-400 line-through mb-1">
                    {product.originalPrice.toLocaleString()}원
                  </p>
                )}
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                  <span className="text-xs text-gray-600">
                    {product.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({product.reviewCount.toLocaleString()})
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Truck className="w-3 h-3" />
                  <span>{product.delivery}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 border-t border-gray-100 py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-900/10 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h3 className="mb-2">AI 자연어 검색</h3>
                <p className="text-sm text-gray-600">
                  평소 말하는 것처럼 자연스럽게 검색하면 AI가 정확한 상품을
                  찾아드립니다
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-900/10 rounded-full flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h3 className="mb-2">스마트 추천</h3>
                <p className="text-sm text-gray-600">
                  구매 패턴과 선호도를 분석하여 딱 맞는 상품을 추천해드립니다
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-900/10 rounded-full flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h3 className="mb-2">실시간 리뷰</h3>
                <p className="text-sm text-gray-600">
                  실제 구매자들의 생생한 후기와 평점을 확인하세요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
