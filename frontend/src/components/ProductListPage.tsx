import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Sparkles, Star } from "lucide-react";
import { useAppState } from "../context/app-state";
import type { Product } from "../types";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Slider } from "./ui/slider";
import { cn } from "./ui/utils";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "여름 린넨 반팔 셔츠",
    price: 29900,
    originalPrice: 45000,
    image: "fashion shirt",
    category: "패션의류",
    brand: "베이직코드",
    rating: 4.8,
    reviewCount: 1234,
    description: "시원한 린넨 소재의 여름 셔츠",
    images: [],
    colors: ["화이트", "블랙", "라이트블루"],
    sizes: ["S", "M", "L", "XL"],
    stock: 150,
  },
  {
    id: "2",
    name: "데일리 클래식 스니커즈",
    price: 49900,
    originalPrice: 79000,
    image: "casual sneakers",
    category: "패션의류",
    brand: "뉴바운스",
    rating: 4.9,
    reviewCount: 2341,
    description: "하루 종일 편안한 데일리 스니커즈",
    images: [],
    colors: ["화이트", "블랙"],
    sizes: ["230", "240", "250", "260", "270"],
    stock: 200,
  },
  {
    id: "3",
    name: "프리미엄 블루투스 이어폰",
    price: 89000,
    image: "wireless earbuds",
    category: "가전디지털",
    brand: "사운드랩",
    rating: 4.7,
    reviewCount: 892,
    description: "노이즈 캔슬링을 지원하는 프리미엄 이어폰",
    images: [],
    colors: ["블랙", "화이트"],
    stock: 80,
  },
  {
    id: "4",
    name: "민감성 보습 크림 대용량",
    price: 24900,
    originalPrice: 35000,
    image: "skincare cream",
    category: "뷰티",
    brand: "내추럴스",
    rating: 4.6,
    reviewCount: 567,
    description: "민감성 피부를 위한 저자극 보습 크림",
    images: [],
    stock: 300,
  },
  {
    id: "5",
    name: "트래블 하드 캐리어 20인치",
    price: 89000,
    originalPrice: 150000,
    image: "luggage suitcase",
    category: "생활/주방",
    brand: "트래블메이트",
    rating: 4.8,
    reviewCount: 445,
    description: "여행에 꼭 필요한 가볍고 튼튼한 캐리어",
    images: [],
    colors: ["실버", "블랙", "로즈골드"],
    stock: 120,
  },
  {
    id: "6",
    name: "프리미엄 요가 매트 10mm",
    price: 39900,
    image: "yoga mat",
    category: "스포츠/레저",
    brand: "핏플랜",
    rating: 4.7,
    reviewCount: 678,
    description: "집에서도 편안하게 운동할 수 있는 두꺼운 요가 매트",
    images: [],
    colors: ["퍼플", "핑크", "그레이"],
    stock: 250,
  },
];

const brands = Array.from(new Set(mockProducts.map((product) => product.brand)));

export function ProductListPage() {
  const navigate = useNavigate();
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
  } = useAppState();

  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      if (selectedCategory !== "all" && selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      if (
        product.price < priceRange[0] ||
        product.price > priceRange[1]
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const normalised = searchQuery.trim().toLowerCase();
        const target = `${product.name} ${product.description ?? ""} ${product.brand}`.toLowerCase();
        return target.includes(normalised);
      }

      return true;
    });
  }, [priceRange, searchQuery, selectedBrands, selectedCategory]);

  const sortedProducts = useMemo(() => {
    const next = [...filteredProducts];
    switch (sortBy) {
      case "latest":
        return next.reverse();
      case "price-low":
        return next.sort((a, b) => a.price - b.price);
      case "price-high":
        return next.sort((a, b) => b.price - a.price);
      case "rating":
        return next.sort((a, b) => b.rating - a.rating);
      default:
        return next.sort((a, b) => b.reviewCount - a.reviewCount);
    }
  }, [filteredProducts, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand],
    );
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSelectedBrands([]);
    setPriceRange([0, 200000]);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-8 md:px-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              {searchQuery ? (
                <>
                  <span className="font-semibold text-gray-900">
                    “{searchQuery}”
                  </span>
                  에 대한 검색 결과입니다.
                </>
              ) : (
                "추천 상품을 확인해 보세요."
              )}
            </p>
            {selectedCategory !== "all" && selectedCategory && (
              <p className="text-xs text-gray-400">
                선택된 카테고리: {selectedCategory}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((prev) => !prev)}
              className="h-9 w-[120px] md:hidden"
            >
              <Filter className="mr-2 h-4 w-4" />
              필터
            </Button>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 w-[150px]">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">인기순</SelectItem>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="price-low">낮은 가격순</SelectItem>
                <SelectItem value="price-high">높은 가격순</SelectItem>
                <SelectItem value="rating">평점순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

          <div className="flex flex-col gap-8 md:flex-row">
            <Card
              className={cn(
                "w-full max-w-xs shrink-0 border-gray-200 md:block",
                showFilters ? "block" : "hidden md:block",
              )}
            >
              <div className="flex items-center justify-between border-b px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  맞춤 필터
                </h3>
                <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                  초기화
                </Button>
              </div>
              <div className="space-y-6 px-5 py-5">
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900">
                    <Sparkles className="h-4 w-4" />
                    카테고리
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="all-category"
                        checked={selectedCategory === "all"}
                        onCheckedChange={() => setSelectedCategory("all")}
                      />
                      <label
                        htmlFor="all-category"
                        className="cursor-pointer text-sm"
                      >
                        전체
                      </label>
                    </div>
                    {Array.from(new Set(mockProducts.map((p) => p.category))).map(
                      (category) => (
                        <div key={category} className="flex items-center">
                          <Checkbox
                            id={`cat-${category}`}
                            checked={selectedCategory === category}
                            onCheckedChange={() =>
                              setSelectedCategory(category)
                            }
                          />
                          <label
                            htmlFor={`cat-${category}`}
                            className="ml-2 cursor-pointer text-sm"
                          >
                            {category}
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-900">
                    브랜드
                  </h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={() => toggleBrand(brand)}
                        />
                        <label
                          htmlFor={`brand-${brand}`}
                          className="ml-2 cursor-pointer text-sm"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-900">
                    가격
                  </h4>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={200000}
                    step={10000}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{priceRange[0].toLocaleString()}원</span>
                    <span>{priceRange[1].toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </Card>

          <div className="flex-1">
            {sortedProducts.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-400">검색 결과가 없습니다.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/")}
                >
                  홈으로 돌아가기
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    className="group cursor-pointer overflow-hidden rounded border border-gray-200 text-left transition hover:shadow-lg"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.originalPrice && (
                        <Badge className="absolute left-2 top-2 border-0 bg-red-500 text-xs text-white">
                          {Math.round(
                            (1 - product.price / product.originalPrice) * 100,
                          )}
                          %
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="text-xs text-gray-500">{product.brand}</p>
                      <p className="line-clamp-2 h-10 text-sm text-gray-900">
                        {product.name}
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-semibold text-gray-900">
                          {product.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">원</span>
                      </div>
                      {product.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          {product.originalPrice.toLocaleString()}원
                        </p>
                      )}
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Star className="h-3 w-3 fill-gray-900 text-gray-900" />
                        <span>{product.rating}</span>
                        <span className="text-gray-400">
                          ({product.reviewCount.toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
