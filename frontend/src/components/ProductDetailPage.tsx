import { useState } from 'react';
import { Star, Truck, Shield, RotateCcw, Plus, Minus, Heart, Share2, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import type { Page, Product, CartItem, User, Review } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: Page) => void;
  onAddToCart: (item: CartItem) => void;
  currentUser: User | null;
}

const mockProduct: Product = {
  id: '1',
  name: '여름 시원한 린넨 반팔 셔츠',
  price: 29900,
  originalPrice: 45000,
  image: 'fashion shirt',
  category: 'fashion',
  brand: '베이직코튼',
  rating: 4.8,
  reviewCount: 1234,
  description: '시원한 린넨 소재로 만든 여름 필수 아이템입니다. 통기성이 뛰어나 더운 여름에도 쾌적하게 착용할 수 있습니다.',
  images: ['fashion shirt', 'linen shirt detail', 'model wearing shirt'],
  colors: ['화이트', '블랙', '네이비', '베이지'],
  sizes: ['S', 'M', 'L', 'XL'],
  stock: 150
};

const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: '김**',
    rating: 5,
    content: '소재가 정말 시원하고 좋아요! 여름에 딱이에요. 사이즈도 정확하고 배송도 빨라서 만족합니다.',
    images: ['review image 1'],
    date: '2025-10-25',
    helpful: 45
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: '이**',
    rating: 4,
    content: '가격 대비 품질이 훌륭합니다. 다만 세탁 후 약간 줄어드니 한 사이즈 크게 구매하시는 걸 추천해요.',
    date: '2025-10-20',
    helpful: 23
  },
  {
    id: '3',
    productId: '1',
    userId: 'user3',
    userName: '박**',
    rating: 5,
    content: '완전 만족! 린넨 소재라 구김이 있긴 하지만 그게 오히려 자연스러워서 좋아요.',
    images: ['review image 2'],
    date: '2025-10-18',
    helpful: 18
  },
];

export function ProductDetailPage({ onNavigate, onAddToCart, currentUser }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(mockProduct.sizes?.[0] || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({
      product: mockProduct,
      quantity,
      selectedColor,
      selectedSize
    });
    toast.success('장바구니에 담았습니다', {
      action: {
        label: '장바구니 가기',
        onClick: () => onNavigate('cart')
      }
    });
  };

  const handleBuyNow = () => {
    if (!currentUser) {
      toast.error('로그인이 필요합니다');
      onNavigate('login');
      return;
    }
    handleAddToCart();
    onNavigate('cart');
  };

  return (
    <div className="bg-white">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <button onClick={() => onNavigate('home')} className="hover:text-gray-900">
            홈
          </button>
          <span>›</span>
          <button onClick={() => onNavigate('products')} className="hover:text-gray-900">
            {mockProduct.category}
          </button>
          <span>›</span>
          <span className="text-gray-900">{mockProduct.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-50 border border-gray-200 overflow-hidden mb-3">
              <ImageWithFallback
                src={`https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80`}
                alt={mockProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map(idx => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-gray-50 border overflow-hidden ${
                    selectedImage === idx ? 'border-gray-900 border-2' : 'border-gray-200'
                  }`}
                >
                  <ImageWithFallback
                    src={`https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=150&q=80`}
                    alt={`${mockProduct.name} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">{mockProduct.brand}</p>
              <h1 className="text-2xl mb-3">{mockProduct.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-gray-900 text-gray-900" />
                  <span>{mockProduct.rating}</span>
                </div>
                <span className="text-sm text-gray-400">리뷰 {mockProduct.reviewCount.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6 mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                {mockProduct.originalPrice && (
                  <Badge className="bg-red-500 text-white border-0">
                    {Math.round((1 - mockProduct.price / mockProduct.originalPrice) * 100)}%
                  </Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl">{mockProduct.price.toLocaleString()}</span>
                <span className="text-lg">원</span>
                {mockProduct.originalPrice && (
                  <span className="text-lg text-gray-400 line-through ml-2">
                    {mockProduct.originalPrice.toLocaleString()}원
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            {mockProduct.colors && (
              <div className="mb-6">
                <h3 className="text-sm mb-3">색상</h3>
                <div className="flex gap-2 flex-wrap">
                  {mockProduct.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border text-sm ${
                        selectedColor === color
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {mockProduct.sizes && (
              <div className="mb-6">
                <h3 className="text-sm mb-3">사이즈</h3>
                <div className="flex gap-2 flex-wrap">
                  {mockProduct.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border text-sm ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm mb-3">수량</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-sm">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500">재고 {mockProduct.stock}개</span>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gray-50 border border-gray-200 p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm">총 상품 금액</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl">{(mockProduct.price * quantity).toLocaleString()}</span>
                  <span>원</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-6">
              <Button
                variant="outline"
                size="icon"
                className="w-12 h-12"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
              >
                장바구니
              </Button>
              <Button
                onClick={handleBuyNow}
                className="flex-1 h-12 bg-gray-900 hover:bg-black text-white"
              >
                구매하기
              </Button>
            </div>

            {/* Benefits */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-gray-400" />
                <span>무료배송 (3만원 이상 구매시)</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-gray-400" />
                <span>100% 정품 보증</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="w-4 h-4 text-gray-400" />
                <span>7일 이내 무료 반품/교환</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="description" className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm px-6">
              상세정보
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm px-6">
              리뷰 ({mockProduct.reviewCount.toLocaleString()})
            </TabsTrigger>
            <TabsTrigger value="qna" className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm px-6">
              Q&A
            </TabsTrigger>
            <TabsTrigger value="exchange" className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none text-sm px-6">
              교환/반품
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="bg-white border border-gray-200 p-8">
              <h2 className="text-lg mb-4">상품 상세정보</h2>
              <p className="text-sm text-gray-700 leading-relaxed mb-6">{mockProduct.description}</p>
              <div className="aspect-video bg-gray-50 border border-gray-200 mb-6">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80"
                  alt="Product detail"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4 text-sm text-gray-700">
                <h3>제품 특징</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>100% 천연 린넨 소재 사용</li>
                  <li>통기성이 뛰어나 여름철 착용에 최적</li>
                  <li>세련된 디자인으로 다양한 스타일링 가능</li>
                  <li>편안한 레귤러 핏</li>
                  <li>세탁 후에도 형태 유지가 우수</li>
                </ul>
              </div>
            </div>
          </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="mb-6">
            <Card className="p-6">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className="text-5xl mb-2">{mockProduct.rating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= mockProduct.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{mockProduct.reviewCount}개 리뷰</p>
                </div>
                <Separator orientation="vertical" className="h-24" />
                <div className="flex-1">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <span className="text-sm w-8">{rating}점</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-900 h-2 rounded-full"
                          style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-12">
                        {rating === 5 ? '70%' : rating === 4 ? '20%' : '5%'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {mockReviews.map(review => (
              <Card key={review.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{review.userName}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.date}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{review.content}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-3">
                    {review.images.map((img, idx) => (
                      <div key={idx} className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&q=80"
                          alt={`Review ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <Button variant="ghost" size="sm">
                  도움됨 {review.helpful}
                </Button>
              </Card>
            ))}
          </div>

          {currentUser && (
            <Button className="w-full mt-6 bg-gray-900 hover:bg-black text-white">
              리뷰 작성하기
            </Button>
          )}
        </TabsContent>

        <TabsContent value="qna" className="mt-6">
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">등록된 문의가 없습니다</p>
            {currentUser && (
              <Button className="bg-gray-900 hover:bg-black text-white">
                문의하기
              </Button>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="exchange" className="mt-6">
          <Card className="p-8">
            <h3 className="text-xl mb-4">교환 및 반품 안내</h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="mb-2">교환/반품 가능 기간</h4>
                <p>상품 수령 후 7일 이내 (단, 상품의 결함 및 오배송의 경우 수령 후 3개월 이내)</p>
              </div>
              <Separator />
              <div>
                <h4 className="mb-2">교환/반품 불가 사유</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>고객의 책임 있는 사유로 상품이 훼손된 경우</li>
                  <li>고객의 사용 또는 일부 소비로 상품 가치가 현저히 감소한 경우</li>
                  <li>시간 경과로 재판매가 곤란할 정도로 상품 가치가 현저히 감소한 경우</li>
                  <li>복제 가능한 상품의 포장을 훼손한 경우</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="mb-2">교환/반품 배송비</h4>
                <p>단순 변심의 경우 왕복 배송비는 고객 부담입니다 (편도 3,000원)</p>
                <p>상품 하자 및 오배송의 경우 배송비는 판매자 부담입니다</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}