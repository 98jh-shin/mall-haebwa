import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, Star, ChevronRight, Truck } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Page } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";

interface HomePageProps {
  onNavigate: (page: Page, productId?: string) => void;
  onCategorySelect: (category: string) => void;
}

interface Product {
  id: string;
  title: string;
  link?: string;
  image?: string;
  lprice?: string;
  mallName?: string;
  brand?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
  productid?: string;
}

export function HomePage({ onNavigate, onCategorySelect }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);

  // ✅ 실제 상품 불러오기
  useEffect(() => {
    fetch("http://localhost:8000/admin/public/products", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => toast.error("상품 데이터를 불러올 수 없습니다."));
  }, []);

  return (
    <div className="bg-white">
      {/* Hero / AI Search 영역 그대로 유지 */}
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

      {/* 베스트 상품 */}
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

        {/* ✅ DB에서 불러온 상품들 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer group"
              onClick={() => onNavigate("product-detail", product.id)}>
              <div className="relative aspect-square bg-gray-50 mb-2 overflow-hidden">
                <ImageWithFallback
                  src={product.image || "/placeholder.png"}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <p className="text-sm mb-1 line-clamp-2 h-10">
                  {product.title}
                </p>
                {product.lprice && (
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-lg">
                      {parseInt(product.lprice).toLocaleString()}
                    </span>
                    <span className="text-sm">원</span>
                  </div>
                )}
                <p className="text-xs text-gray-500">{product.mallName}</p>
                <p className="text-xs text-gray-400">
                  {product.brand || product.category1}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
