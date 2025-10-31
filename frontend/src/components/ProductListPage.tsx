import { useState, useEffect } from "react";
import { Star, Filter, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import type { Page, Product } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductListPageProps {
  onNavigate: (page: Page, productId?: string) => void;
  selectedCategory: string;
  searchQuery: string;
}

// 서버 응답 스키마 (백엔드 /admin/public/products)
interface ServerProduct {
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
}

export function ProductListPage({
  onNavigate,
  selectedCategory,
  searchQuery,
}: ProductListPageProps) {
  const [sortBy, setSortBy] = useState("popular");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // 서버에서 상품 목록 로드
  useEffect(() => {
    fetch("http://localhost:8000/admin/public/products", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: ServerProduct[]) => {
        const mapped: Product[] = data.map((p) => ({
          id: p.id,
          name: p.title,
          price: Number(p.lprice || 0),
          originalPrice: undefined,
          image: p.image || "/placeholder.png",
          category: p.category1 || "",
          brand: p.brand || p.category1 || "",
          rating: 0,
          reviewCount: 0,
          description: "",
          images: [],
          stock: 999,
        }));
        setProducts(mapped);
        setFilteredProducts(mapped);
        const brands = Array.from(
          new Set(mapped.map((m) => m.brand).filter(Boolean))
        ) as string[];
        setAvailableBrands(brands);
      })
      .catch(() => {
        setProducts([]);
        setFilteredProducts([]);
        setAvailableBrands([]);
      });
  }, []);

  useEffect(() => {
    let filtered = products;

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search query filter (AI search simulation)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "popular":
        filtered = [...filtered].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "latest":
        break;
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, selectedBrands, priceRange, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
      {/* AI Search Result Banner */}
      {searchQuery && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded p-4 mb-6">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm mb-1">AI가 분석한 검색 결과</h3>
              <p className="text-sm text-gray-600">
                "<span className="text-purple-600">{searchQuery}</span>"
                검색어로
                <span className="text-gray-900">
                  {" "}
                  {filteredProducts.length}개의 상품
                </span>
                을 찾았습니다
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-56 shrink-0`}>
          <div className="border border-gray-200 rounded p-4 sticky top-24 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm flex items-center gap-2">
                <Filter className="w-4 h-4" />
                필터
              </h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  setSelectedBrands([]);
                  setPriceRange([0, 200000]);
                }}>
                초기화
              </Button>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="text-sm mb-3">브랜드</h4>
              <div className="space-y-2">
                {availableBrands.map((brand) => (
                  <div key={brand} className="flex items-center gap-2">
                    <Checkbox
                      id={brand}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                    />
                    <label htmlFor={brand} className="text-sm cursor-pointer">
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="text-sm mb-3">가격</h4>
              <div className="px-2">
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
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort and Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              총{" "}
              <span className="text-gray-900">{filteredProducts.length}</span>개
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden h-8 text-xs"
                onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-3 h-3 mr-1" />
                필터
              </Button>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[120px] h-8 text-sm">
                  <SelectValue />
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

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">검색 결과가 없습니다</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => onNavigate("home")}>
                홈으로 돌아가기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="cursor-pointer group"
                  onClick={() => onNavigate("product-detail", product.id)}>
                  <div className="relative aspect-square bg-gray-50 mb-2 overflow-hidden border border-gray-200 rounded">
                    <ImageWithFallback
                      src={product.image}
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
                    <p className="text-xs text-gray-500 mb-1">
                      {product.brand}
                    </p>
                    <p className="text-sm mb-1 line-clamp-2 h-10">
                      {product.name}
                    </p>
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
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400">
                        ({product.reviewCount.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

