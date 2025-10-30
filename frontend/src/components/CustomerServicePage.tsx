import { useState } from 'react';
import { Phone, Mail, Clock, HelpCircle, FileText, MessageSquare, Package, RotateCcw, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { toast } from 'sonner@2.0.3';
import type { Page } from '../App';

interface CustomerServicePageProps {
  onNavigate: (page: Page) => void;
}

const faqData = [
  {
    category: '주문/결제',
    items: [
      {
        question: '주문 취소는 어떻게 하나요?',
        answer: '주문 취소는 마이페이지 > 주문내역에서 가능합니다. 배송 준비 중 상태에서만 취소가 가능하며, 배송이 시작된 이후에는 반품 절차를 진행해주셔야 합니다.'
      },
      {
        question: '결제 방법은 어떤 것들이 있나요?',
        answer: '신용카드, 체크카드, 계좌이체, 무통장입금, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다.'
      },
      {
        question: '주문 확인 및 영수증은 어디서 받을 수 있나요?',
        answer: '마이페이지 > 주문내역에서 주문 상세 정보와 영수증을 확인하실 수 있습니다. 이메일로도 자동 발송됩니다.'
      }
    ]
  },
  {
    category: '배송',
    items: [
      {
        question: '배송 기간은 얼마나 걸리나요?',
        answer: '일반 배송의 경우 주문 후 2-3일 소요됩니다. 일부 상품은 당일 또는 익일 배송이 가능하며, 상품 상세 페이지에서 확인하실 수 있습니다.'
      },
      {
        question: '배송 조회는 어떻게 하나요?',
        answer: '마이페이지 > 주문내역에서 운송장 번호를 확인하실 수 있으며, 택배사 홈페이지에서 실시간 배송 조회가 가능합니다.'
      },
      {
        question: '배송비는 얼마인가요?',
        answer: '30,000원 이상 구매 시 무료배송이며, 미만 시 3,000원의 배송비가 부과됩니다. 제주/도서산간 지역은 추가 배송비가 발생할 수 있습니다.'
      }
    ]
  },
  {
    category: '반품/교환',
    items: [
      {
        question: '반품은 어떻게 신청하나요?',
        answer: '상품 수령 후 7일 이내 마이페이지 > 주문내역에서 반품 신청이 가능합니다. 단, 상품의 택과 포장이 훼손되지 않은 경우에만 가능합니다.'
      },
      {
        question: '교환 비용은 누가 부담하나요?',
        answer: '상품 하자나 오배송의 경우 무료로 교환해드립니다. 단순 변심의 경우 왕복 배송비(6,000원)를 고객님께서 부담하셔야 합니다.'
      },
      {
        question: '반품 불가 상품이 있나요?',
        answer: '식품, 화장품 등 개봉 시 재판매가 어려운 상품과 주문 제작 상품은 반품이 불가능합니다. 각 상품의 상세 페이지에서 확인해주세요.'
      }
    ]
  },
  {
    category: '회원/포인트',
    items: [
      {
        question: '회원가입 시 혜택이 있나요?',
        answer: '신규 회원가입 시 즉시 사용 가능한 5,000원 쿠폰을 드립니다. 또한 구매 금액의 1%가 포인트로 적립됩니다.'
      },
      {
        question: '포인트는 언제 적립되나요?',
        answer: '구매 확정 후 자동으로 적립되며, 배송 완료 후 7일이 지나면 자동으로 구매 확정 처리됩니다.'
      },
      {
        question: '비밀번호를 잊어버렸어요.',
        answer: '로그인 페이지에서 "비밀번호 찾기"를 클릭하시면 가입하신 이메일로 비밀번호 재설정 링크를 보내드립니다.'
      }
    ]
  }
];

const notices = [
  {
    id: 1,
    title: '[공지] 추석 연휴 배송 및 고객센터 운영 안내',
    date: '2025-10-25',
    important: true
  },
  {
    id: 2,
    title: '[이벤트] 가을맞이 전 품목 최대 50% 할인',
    date: '2025-10-20',
    important: true
  },
  {
    id: 3,
    title: '[안내] 개인정보처리방침 변경 안내',
    date: '2025-10-15',
    important: false
  },
  {
    id: 4,
    title: '[점검] 시스템 정기 점검 안내 (10/31 02:00-04:00)',
    date: '2025-10-10',
    important: false
  }
];

export function CustomerServicePage({ onNavigate }: CustomerServicePageProps) {
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('주문/결제');
  const [inquiryType, setInquiryType] = useState('');
  const [inquiryTitle, setInquiryTitle] = useState('');
  const [inquiryContent, setInquiryContent] = useState('');

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiryType || !inquiryTitle || !inquiryContent) {
      toast.error('모든 항목을 입력해주세요');
      return;
    }

    toast.success('문의가 접수되었습니다. 빠른 시일 내에 답변 드리겠습니다.');
    setInquiryType('');
    setInquiryTitle('');
    setInquiryContent('');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl mb-2">고객센터</h1>
          <p className="text-sm text-gray-600">무엇을 도와드릴까요?</p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <p className="text-sm text-gray-600">전화 상담</p>
                <p className="text-lg">1588-1234</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <p className="text-sm text-gray-600">이메일 문의</p>
                <p className="text-lg">help@mallhae.com</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">24시간 접수 가능 (답변은 영업일 기준 1-2일)</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <p className="text-sm text-gray-600">운영 시간</p>
                <p className="text-lg">09:00 - 18:00</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">점심시간: 12:00 - 13:00</p>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="faq" className="gap-2">
              <HelpCircle className="w-4 h-4" />
              자주 묻는 질문
            </TabsTrigger>
            <TabsTrigger value="inquiry" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              1:1 문의
            </TabsTrigger>
            <TabsTrigger value="notice" className="gap-2">
              <FileText className="w-4 h-4" />
              공지사항
            </TabsTrigger>
            <TabsTrigger value="guide" className="gap-2">
              <Package className="w-4 h-4" />
              이용 안내
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <div className="grid md:grid-cols-4 gap-6">
              {/* Category Sidebar */}
              <div className="space-y-2">
                {faqData.map((category) => (
                  <button
                    key={category.category}
                    onClick={() => setSelectedFaqCategory(category.category)}
                    className={`w-full text-left px-4 py-3 rounded border transition-colors ${
                      selectedFaqCategory === category.category
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {category.category}
                  </button>
                ))}
              </div>

              {/* FAQ Content */}
              <div className="md:col-span-3">
                <Card className="p-6">
                  <h2 className="text-lg mb-4">{selectedFaqCategory}</h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {faqData
                      .find((cat) => cat.category === selectedFaqCategory)
                      ?.items.map((item, index) => (
                        <AccordionItem
                          key={index}
                          value={`item-${index}`}
                          className="border border-gray-200 rounded px-4"
                        >
                          <AccordionTrigger className="hover:no-underline py-4">
                            <span className="text-sm text-left">Q. {item.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-gray-600 pb-4">
                            A. {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 1:1 Inquiry Tab */}
          <TabsContent value="inquiry">
            <Card className="p-6">
              <h2 className="text-lg mb-4">1:1 문의하기</h2>
              <p className="text-sm text-gray-600 mb-6">
                궁금하신 사항을 남겨주시면 빠르게 답변 드리겠습니다. (영업일 기준 1-2일 소요)
              </p>

              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div>
                  <Label htmlFor="inquiryType">
                    문의 유형 <span className="text-red-500">*</span>
                  </Label>
                  <Select value={inquiryType} onValueChange={setInquiryType} required>
                    <SelectTrigger id="inquiryType" className="mt-1.5">
                      <SelectValue placeholder="선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">주문/결제</SelectItem>
                      <SelectItem value="delivery">배송</SelectItem>
                      <SelectItem value="return">반품/교환</SelectItem>
                      <SelectItem value="product">상품 문의</SelectItem>
                      <SelectItem value="account">회원/계정</SelectItem>
                      <SelectItem value="etc">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="inquiryTitle">
                    제목 <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="inquiryTitle"
                    placeholder="문의 제목을 입력하세요"
                    value={inquiryTitle}
                    onChange={(e) => setInquiryTitle(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="inquiryContent">
                    문의 내용 <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="inquiryContent"
                    placeholder="문의하실 내용을 자세히 입력해주세요"
                    value={inquiryContent}
                    onChange={(e) => setInquiryContent(e.target.value)}
                    rows={8}
                    className="mt-1.5 resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onNavigate('home')}
                    className="flex-1"
                  >
                    취소
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gray-900 hover:bg-black text-white gap-2"
                  >
                    <Send className="w-4 h-4" />
                    문의 접수
                  </Button>
                </div>
              </form>

              <div className="mt-8 p-4 bg-gray-50 rounded border border-gray-200">
                <h3 className="text-sm mb-2">문의 전 확인해주세요</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 자주 묻는 질문에서 답변을 먼저 확인해보세요</li>
                  <li>• 주문번호를 함께 기재하시면 더 빠른 답변이 가능합니다</li>
                  <li>• 답변은 이메일로도 발송됩니다</li>
                </ul>
              </div>
            </Card>
          </TabsContent>

          {/* Notice Tab */}
          <TabsContent value="notice">
            <Card className="p-6">
              <h2 className="text-lg mb-4">공지사항</h2>
              <div className="space-y-3">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex items-center justify-between py-4 border-b border-gray-200 last:border-0 hover:bg-gray-50 cursor-pointer px-3 -mx-3 rounded"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {notice.important && (
                        <span className="px-2 py-0.5 bg-gray-900 text-white text-xs rounded">
                          중요
                        </span>
                      )}
                      <span className="text-sm">{notice.title}</span>
                    </div>
                    <span className="text-xs text-gray-500">{notice.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 배송 안내 */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-gray-900" />
                  </div>
                  <h3 className="text-lg">배송 안내</h3>
                </div>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <p className="mb-1">배송비</p>
                    <p className="text-xs">• 30,000원 이상 구매 시 무료배송</p>
                    <p className="text-xs">• 30,000원 미만 시 배송비 3,000원</p>
                  </div>
                  <div>
                    <p className="mb-1">배송 기간</p>
                    <p className="text-xs">• 일반 배송: 2-3일 소요</p>
                    <p className="text-xs">• 당일/익일 배송 상품 별도 표기</p>
                  </div>
                  <div>
                    <p className="mb-1">배송 지역</p>
                    <p className="text-xs">• 전국 배송 가능</p>
                    <p className="text-xs">• 제주/도서산간 지역 추가 배송비 발생</p>
                  </div>
                </div>
              </Card>

              {/* 반품/교환 안내 */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-gray-900" />
                  </div>
                  <h3 className="text-lg">반품/교환 안내</h3>
                </div>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <p className="mb-1">반품/교환 가능 기간</p>
                    <p className="text-xs">• 상품 수령 후 7일 이내</p>
                    <p className="text-xs">• 상품 택, 포장 미훼손 시</p>
                  </div>
                  <div>
                    <p className="mb-1">반품/교환 비용</p>
                    <p className="text-xs">• 단순 변심: 왕복 배송비 6,000원</p>
                    <p className="text-xs">• 상품 하자/오배송: 무료</p>
                  </div>
                  <div>
                    <p className="mb-1">반품 불가 상품</p>
                    <p className="text-xs">• 식품, 화장품 등 개봉 시</p>
                    <p className="text-xs">• 주문 제작 상품</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
