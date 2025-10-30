import { useState, useEffect } from 'react';
import { Star, Filter, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import type { Page, Product } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductListPageProps {
  onNavigate: (page: Page, productId?: string) => void;
  selectedCategory: string;
  searchQuery: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: '여름 시원한 린넨 반팔 셔츠',
    price: 29900,
    originalPrice: 45000,
    image: 'fashion shirt',
    category: 'fashion',
    brand: '베이직코튼',
    rating: 4.8,
    reviewCount: 1234,
    description: '시원한 린넨 소재로 만든 여름 필수 아이템',
    images: [],
    colors: ['화이트', '블랙', '네이비'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 150
  },
  {
    id: '2',
    name: '편안한 운동화 데일리 스니커즈',
    price: 49900,
    originalPrice: 79000,
    image: 'casual sneakers',
    category: 'fashion',
    brand: '워크앤런',
    rating: 4.9,
    reviewCount: 2341,
    description: '출근부터 운동까지 하루종일 편안한 스니커즈',
    images: [],
    colors: ['화이트', '블랙'],
    sizes: ['230', '240', '250', '260', '270'],
    stock: 200
  },
  {
    id: '3',
    name: '무선 블루투스 이어폰 프리미엄',
    price: 89000,
    image: 'wireless earbuds',
    category: 'digital',
    brand: '사운드프로',
    rating: 4.7,
    reviewCount: 892,
    description: '노이즈 캔슬링 기능의 프리미엄 이어폰',
    images: [],
    colors: ['블랙', '화이트'],
    stock: 80
  },
  {
    id: '4',
    name: '천연 보습 크림 대용량',
    price: 24900,
    originalPrice: 35000,
    image: 'skincare cream',
    category: 'beauty',
    brand: '네이처스킨',
    rating: 4.6,
    reviewCount: 567,
    description: '민감성 피부도 안심하고 사용하는 천연 보습 크림',
    images: [],
    stock: 300
  },
  {
    id: '5',
    name: '가볍고 튼튼한 캐리어 20인치',
    price: 89000,
    originalPrice: 150000,
    image: 'luggage suitcase',
    category: 'life',
    brand: '트래블메이트',
    rating: 4.8,
    reviewCount: 445,
    description: '여행의 필수품, 가볍고 내구성 좋은 캐리어',
    images: [],
    colors: ['실버', '블랙', '로즈골드'],
    stock: 120
  },
  {
    id: '6',
    name: '프리미엄 요가매트 두께 10mm',
    price: 39900,
    image: 'yoga mat',
    category: 'sports',
    brand: '홈핏',
    rating: 4.7,
    reviewCount: 678,
    description: '집에서 편하게 운동할 수 있는 두툼한 요가매트',
    images: [],
    colors: ['퍼플', '핑크', '그레이'],
    stock: 250
  },
  {
    id: '7',
    name: '유기농 아기 물티슈 10팩',
    price: 19900,
    image: 'baby wipes',
    category: 'baby',
    brand: '베이비케어',
    rating: 4.9,
    reviewCount: 1567,
    description: '민감한 아기 피부를 위한 유기농 물티슈',
    images: [],
    stock: 500
  },
  {
    id: '8',
    name: '베스트셀러 자기계발서 세트',
    price: 45000,
    originalPrice: 60000,
    image: 'books collection',
    category: 'book',
    brand: '북스토리',
    rating: 4.8,
    reviewCount: 234,
    description: '인생을 바꾸는 필독 자기계발서 3권 세트',
    images: [],
    stock: 180
  },
];

const brands = ['베이직코튼', '워크앤런', '사운드프로', '네이처스킨', '트래블메이트', '홈핏', '베이비케어', '북스토리'];

export function ProductListPage({ onNavigate, selectedCategory, searchQuery }: ProductListPageProps) {
  const [sortBy, setSortBy] = useState('popular');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = mockProducts;

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search query filter (AI search simulation)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p => selectedBrands.includes(p.brand));
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'latest':
        // In real app, would sort by date
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, selectedBrands, priceRange, sortBy]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
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
                "<span className="text-purple-600">{searchQuery}</span>" 검색어로 
                <span className="text-gray-900"> {filteredProducts.length}개의 상품</span>을 찾았습니다
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0`}>
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
                }}
              >
                초기화
              </Button>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h4 className="text-sm mb-3">브랜드</h4>
              <div className="space-y-2">
                {brands.map(brand => (
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
              총 <span className="text-gray-900">{filteredProducts.length}</span>개
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="md:hidden h-8 text-xs"
                onClick={() => setShowFilters(!showFilters)}
              >
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
                onClick={() => onNavigate('home')}
              >
                홈으로 돌아가기
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="cursor-pointer group"
                  onClick={() => onNavigate('product-detail', product.id)}
                >
                  <div className="relative aspect-square bg-gray-50 mb-2 overflow-hidden border border-gray-200 rounded">
                    <ImageWithFallback
                      src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-xs">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <p className="text-sm mb-1 line-clamp-2 h-10">{product.name}</p>
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-lg">{product.price.toLocaleString()}</span>
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
                      <span className="text-gray-400">({product.reviewCount.toLocaleString()})</span>
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