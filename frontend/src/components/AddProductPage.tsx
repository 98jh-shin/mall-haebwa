import { useState } from 'react';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import type { Page } from '../App';

interface AddProductPageProps {
  onNavigate: (page: Page) => void;
}

export function AddProductPage({ onNavigate }: AddProductPageProps) {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !price || !category || !stock) {
      toast.error('필수 항목을 모두 입력해주세요');
      return;
    }

    toast.success('상��이 등록되었습니다');
    onNavigate('admin');
  };

  const handleAddImage = () => {
    // Mock image upload
    toast.info('실제 환경에서는 이미지 업로드가 실행됩니다');
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1000px] mx-auto px-6 md:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => onNavigate('admin')}
            className="mb-4 -ml-2 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            셀러 센터로 돌아가기
          </Button>
          <h1 className="text-2xl mb-1">상품 등록</h1>
          <p className="text-sm text-gray-600">새로운 상품을 등록하고 판매를 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg mb-4">기본 정보</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="productName">
                  상품명 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="productName"
                  placeholder="예: 여름 시원한 린넨 반팔 셔츠"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">
                    카테고리 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger id="category" className="mt-1.5">
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">패션의류</SelectItem>
                      <SelectItem value="beauty">뷰티</SelectItem>
                      <SelectItem value="food">식품</SelectItem>
                      <SelectItem value="living">생활/주방</SelectItem>
                      <SelectItem value="digital">가전디지털</SelectItem>
                      <SelectItem value="sports">스포츠/레저</SelectItem>
                      <SelectItem value="baby">출산/육아</SelectItem>
                      <SelectItem value="book">도서</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="brand">브랜드</Label>
                  <Input
                    id="brand"
                    placeholder="예: 베이직코튼"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">
                    판매가 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="price"
                      type="number"
                      placeholder="29900"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      원
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="originalPrice">정가</Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="originalPrice"
                      type="number"
                      placeholder="45000"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      원
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="stock">
                    재고 수량 <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <Input
                      id="stock"
                      type="number"
                      placeholder="100"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                      개
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg mb-4">상품 이미지</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                최대 10장까지 등록 가능합니다. 첫 번째 이미지가 대표 이미지로 사용됩니다.
              </p>
              <div className="grid grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded border border-gray-200">
                    <img src={image} alt={`상품 이미지 ${index + 1}`} className="w-full h-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-black"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2">
                        <span className="bg-gray-900 text-white text-xs px-2 py-0.5 rounded">대표</span>
                      </div>
                    )}
                  </div>
                ))}
                {images.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded hover:border-gray-400 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="text-xs text-gray-500">이미지 추가</span>
                  </button>
                )}
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg mb-4">상품 설명</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">상세 설명</Label>
                <Textarea
                  id="description"
                  placeholder="상품에 대한 상세한 설명을 입력하세요&#10;&#10;• 소재 및 재질&#10;• 사이즈 정보&#10;• 세탁 방법&#10;• 제조국"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={8}
                  className="mt-1.5 resize-none"
                />
              </div>
            </div>
          </Card>

          {/* Options */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg mb-4">옵션 설정</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="colors">색상 옵션</Label>
                <Input
                  id="colors"
                  placeholder="화이트, 블랙, 네이비 (쉼표로 구분)"
                  value={colors}
                  onChange={(e) => setColors(e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  쉼표(,)로 구분하여 입력하세요
                </p>
              </div>

              <div>
                <Label htmlFor="sizes">사이즈 옵션</Label>
                <Input
                  id="sizes"
                  placeholder="S, M, L, XL (쉼표로 구분)"
                  value={sizes}
                  onChange={(e) => setSizes(e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  쉼표(,)로 구분하여 입력하세요
                </p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onNavigate('admin')}
              className="flex-1 h-12"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 bg-gray-900 hover:bg-black text-white"
            >
              상품 등록하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
