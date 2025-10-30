import { useState } from "react";
import { Trash2, Plus, Minus, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { toast } from "sonner";
import type { Page, CartItem, User } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CartPageProps {
  cart: CartItem[];
  onNavigate: (page: Page) => void;
  onUpdateCart: (index: number, quantity: number) => void;
  onRemoveFromCart: (index: number) => void;
  currentUser: User | null;
}

export function CartPage({
  cart,
  onNavigate,
  onUpdateCart,
  onRemoveFromCart,
  currentUser,
}: CartPageProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>(
    cart.map((_, i) => i)
  );
  const [couponCode, setCouponCode] = useState("");

  const toggleItem = (index: number) => {
    setSelectedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map((_, i) => i));
    }
  };

  const selectedTotal = cart
    .filter((_, i) => selectedItems.includes(i))
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const deliveryFee = selectedTotal >= 30000 ? 0 : 3000;
  const finalTotal = selectedTotal + deliveryFee;

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("구매할 상품을 선택해주세요");
      return;
    }
    if (!currentUser) {
      toast.error("로그인이 필요합니다");
      onNavigate("login");
      return;
    }
    toast.success("주문이 완료되었습니다!");
    selectedItems
      .sort((a, b) => b - a)
      .forEach((index) => {
        onRemoveFromCart(index);
      });
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "welcome10") {
      toast.success("10% 할인 쿠폰이 적용되었습니다!");
    } else {
      toast.error("유효하지 않은 쿠폰 코드입니다");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl mb-2">장바구니가 비어있습니다</h2>
          <p className="text-sm text-gray-600 mb-6">
            원하시는 상품을 담아보세요!
          </p>
          <Button
            onClick={() => onNavigate("home")}
            className="bg-gray-900 hover:bg-black text-white h-10">
            쇼핑 계속하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-6">
        <h1 className="text-2xl mb-6">장바구니</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white border border-gray-200 p-4 mb-4">
              <div className="flex items-center gap-2 mb-4 text-sm">
                <Checkbox
                  checked={selectedItems.length === cart.length}
                  onCheckedChange={toggleAll}
                />
                <span>
                  전체 선택 ({selectedItems.length}/{cart.length})
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs ml-auto"
                  onClick={() => {
                    const itemsToRemove = [...selectedItems].sort(
                      (a, b) => b - a
                    );
                    itemsToRemove.forEach((index) => onRemoveFromCart(index));
                    toast.success("선택한 상품을 삭제했습니다");
                  }}
                  disabled={selectedItems.length === 0}>
                  선택 삭제
                </Button>
              </div>

              <Separator className="mb-4" />

              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 border border-gray-200">
                    <Checkbox
                      checked={selectedItems.includes(index)}
                      onCheckedChange={() => toggleItem(index)}
                    />
                    <div className="w-20 h-20 bg-gray-50 border border-gray-200 overflow-hidden shrink-0">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80"
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm mb-2">{item.product.name}</h3>
                      {item.selectedColor && (
                        <p className="text-xs text-gray-500">
                          색상: {item.selectedColor}
                        </p>
                      )}
                      {item.selectedSize && (
                        <p className="text-xs text-gray-500">
                          사이즈: {item.selectedSize}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-300">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              onUpdateCart(
                                index,
                                Math.max(1, item.quantity - 1)
                              )
                            }>
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              onUpdateCart(index, item.quantity + 1)
                            }>
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <span className="text-sm">
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                          원
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        onRemoveFromCart(index);
                        toast.success("상품을 삭제했습니다");
                      }}>
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white border border-gray-200 p-4">
              <h3 className="text-sm mb-3">쿠폰</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="쿠폰 코드 입력 (예: WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="text-sm h-9"
                />
                <Button
                  onClick={applyCoupon}
                  className="bg-gray-900 hover:bg-black text-white shrink-0 h-9 text-sm">
                  적용
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white border border-gray-200 p-6 sticky top-24">
              <h3 className="mb-4">결제 금액</h3>
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>상품금액</span>
                  <span>{selectedTotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span>
                    {deliveryFee === 0
                      ? "무료"
                      : deliveryFee.toLocaleString() + "원"}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-xs text-gray-900">
                    {(30000 - selectedTotal).toLocaleString()}원 더 구매 시
                    무료배송
                  </p>
                )}
                <Separator />
                <div className="flex justify-between items-center">
                  <span>총 결제금액</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl">
                      {finalTotal.toLocaleString()}
                    </span>
                    <span>원</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full bg-gray-900 hover:bg-black text-white mb-2 h-12">
                {selectedItems.length}개 상품 주문하기
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate("home")}
                className="w-full h-10 text-sm">
                쇼핑 계속하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
