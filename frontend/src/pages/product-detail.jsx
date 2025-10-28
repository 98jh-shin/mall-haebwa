import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  StarHalf,
  StarOff,
  Heart,
  Share2,
  BadgeCheck,
  PackageCheck,
  Truck,
  ShieldCheck,
  Gift,
  Calendar,
  RefreshCcw,
  MessageCircle,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Box,
  LineChart,
  ThumbsUp,
} from "lucide-react";
import TopBar from "../components/topbar";
const PRODUCT = {
  id: "NX-9043",
  brand: "NEOVOX",
  name: "2025 네오보이스 노이즈캔슬링 이어버드 프로",
  tagline: "몰입감 극대화, 42시간 올데이 배터리와 하이파이 사운드",
  price: 179000,
  originalPrice: 239000,
  rating: 4.8,
  reviewCount: 1264,
  likes: 3187,
  deliveryDate: "7월 3일(수) 새벽 도착 확률 95%",
  summaryPoints: [
    "신형 VITA Ultra 칩셋 탑재로 끊김 없는 연결",
    "듀얼 ANC + 어댑티브 이퀄라이저 지원",
    "Qi 무선 충전 & IPX5 방수 설계",
  ],
};
const PRODUCT_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1580894906472-0e2631cab6a0?auto=format&fit=crop&w=900&q=80",
    alt: "네오보이스 이어버드 프로 전면 이미지",
    caption: "다크메탈 컬러, 무광 하우징과 곡선형 스템 디자인",
  },
  {
    src: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
    alt: "이어버드 충전 크래들 오픈샷",
    caption: "사이드 LED 인디케이터와 CNC 가공 힌지 구조",
  },
  {
    src: "https://images.unsplash.com/photo-1619841825498-1ff4f2a77eb2?auto=format&fit=crop&w=900&q=80",
    alt: "이어버드 착용 라이프스타일 컷",
    caption: "하루 종일 편안한 인체공학적 핏",
  },
  {
    src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    alt: "이어버드 내부 드라이버 구조",
    caption: "하이파이 듀얼 드라이버와 어쿠스틱 챔버 설계",
  },
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    alt: "이어버드 패키지 구성품",
    caption: "사이즈별 팁, USB-C 케이블, 전용 파우치 구성",
  },
];
const DELIVERY_INFO = [
  {
    icon: Truck,
    title: "오늘 주문, 내일 새벽 배송",
    description: "수도권 한정 95% 당일 출고, 주말에도 새벽 도착",
    footnote: "무료 새벽배송은 4만원 이상 구매 시 적용",
  },
  {
    icon: PackageCheck,
    title: "정품 보증 & 30일 체험",
    description: "30일 안심 체험 후 불만족 시 무조건 환불",
    footnote: "단, 구성품 누락 또는 손상 시 일부 금액 공제",
  },
  {
    icon: RefreshCcw,
    title: "1년 프리미엄 A/S",
    description: "무상 클리닝, 배터리 점검, 펌웨어 업그레이드 제공",
    footnote: "센터 방문 및 택배 왕복비 1회 무료 지원",
  },
];
const SERVICE_BADGES = [
  {
    icon: ShieldCheck,
    label: "공식 판매처 보증",
    description: "네오보이스 본사 직영 스토어",
  },
  {
    icon: Calendar,
    label: "24개월 무이자",
    description: "롯데/현대/신한 카드 5만원 이상",
  },
  {
    icon: Gift,
    label: "네이버페이 더블 적립",
    description: "기본 1% + 멤버십 5% 적립",
  },
];
const SPECIFICATIONS = [
  { label: "모델명", value: "NXE-B43 Pro" },
  { label: "칩셋", value: "VITA Ultra Q3" },
  { label: "노이즈캔슬링", value: "듀얼 마이크 하이브리드 ANC (최대 42dB)" },
  { label: "배터리", value: "이어버드 7시간 / 케이스 포함 42시간" },
  { label: "충전", value: "USB-C 고속 + Qi 무선 충전" },
  { label: "방수 등급", value: "IPX5 생활 방수" },
  { label: "코덱", value: "aptX Adaptive / AAC / SBC" },
  { label: "무게", value: "이어버드 4.8g / 충전 케이스 38g" },
  { label: "호환 OS", value: "Android 8.0+, iOS 14.0+" },
  { label: "동봉 액세서리", value: "실리콘 팁 3쌍, USB-C 케이블, 파우치" },
];
const HIGHLIGHTS = [
  {
    title: "듀얼 드라이버 하이파이 구조",
    description:
      "11mm 우퍼 + 6mm 트위터 조합으로 저음은 탄탄하게, 고음은 투명하게 구현합니다. 네오보이스 시그니처 EQ 프리셋은 장르별로 자동 적용됩니다.",
    icon: LineChart,
  },
  {
    title: "상황별 똑똑한 ANC",
    description:
      "도심, 카페, 출퇴근 등 주변 환경을 인식해 노이즈캔슬링 강도를 자동 조절합니다. 투명 모드 전환 시 목소리 강조 기능으로 대화도 편합니다.",
    icon: Sparkles,
  },
  {
    title: "게임 & 업무를 위한 저지연 모드",
    description:
      "게임 모드 활성화 시 지연 시간이 48ms로 줄어 FPS 게임이나 화상회의에서도 음성이 또렷하게 전달됩니다.",
    icon: Box,
  },
];
const REVIEW_DISTRIBUTION = [
  { label: "5점", percent: 72, count: 910 },
  { label: "4점", percent: 21, count: 264 },
  { label: "3점", percent: 5, count: 63 },
  { label: "2점", percent: 1, count: 18 },
  { label: "1점", percent: 1, count: 9 },
];
const REVIEW_QUOTES = [
  {
    user: "chan****",
    title: "기존 모델 대비 확실한 업그레이드",
    body: "바람 많은 출퇴근길에도 노이즈캔슬링이 똑똑하게 적용돼요. 통화 품질도 만족스럽고, 배터리가 진짜 오래갑니다.",
    highlight: "ANC 만족도 98%",
  },
  {
    user: "luna****",
    title: "아이폰, 맥 연동 너무 편해요",
    body: "애플 기기에서 끊김 없이 전환되는 게 제일 좋았어요. 전용 앱에서 EQ 조절이 세밀해서 장르별 세팅이 쉬워요.",
    highlight: "멀티페어링 호평",
  },
  {
    user: "gong****",
    title: "게임할 때 딜레이 거의 없음",
    body: "모바일 게임 좋아하는데, 저지연 모드 켜면 터치와 사운드가 동시에 반응합니다. 영상회의에서도 음성이 깨끗하다고 하네요.",
    highlight: "저지연 모드 극찬",
  },
];
const QNA_ITEMS = [
  {
    question: "아이폰과 안드로이드 모두에서 주변 소리 모드가 되나요?",
    answer:
      "네, 네오보이스 앱에서 양쪽 플랫폼 동일하게 ANC 강도와 주변 소리 수준을 조절할 수 있습니다. 펌웨어 업데이트도 모바일에서 진행돼요.",
    meta: "상품 Q&A • 3시간 전",
  },
  {
    question: "무선 충전 패드로 충전하면 발열이 심하지 않은가요?",
    answer:
      "Qi 인증 패드에서 10W 이하로 충전하도록 설계되어 발열이 발생해도 자동으로 전력량을 조절해 안전하게 충전됩니다.",
    meta: "상품 Q&A • 1일 전",
  },
  {
    question: "이어팁 교체용은 추가로 구매 가능한가요?",
    answer:
      "네, 전용 메모리폼 팁과 실리콘 팁 모두 공식 스토어에서 별도 판매하고 있습니다. 구매 시 기본 무료 배송이 적용돼요.",
    meta: "판매자 답변 • 2일 전",
  },
];
const RECOMMENDED_PRODUCTS = [
  {
    id: "A1",
    title: "네오보이스 무선 충전 패드 듀오",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
    price: 49000,
    tags: ["함께 쓰면 좋아요", "Qi 15W"],
  },
  {
    id: "A2",
    title: "하이브리드 메모리폼 이어팁 3쌍",
    image:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80",
    price: 12900,
    tags: ["맞춤 밀폐감", "피로 최소화"],
  },
  {
    id: "A3",
    title: "네오보이스 어쿠스틱 파우치",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80",
    price: 18900,
    tags: ["충격 보호", "생활 방수"],
  },
];
const BENEFIT_TAGS = [
  { label: "최대 8,950P 적립", tone: "brand" },
  { label: "구매 확정 시 보증 연장 +6개월", tone: "purple" },
  { label: "첫 구매 추가 3% 할인", tone: "sky" },
];
function formatCurrency(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}
export default function ProductDetailPage() {
  const navigate = useNavigate();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = PRODUCT_IMAGES[activeImageIndex] ?? PRODUCT_IMAGES[0];
  const discountLabel = useMemo(() => {
    if (!PRODUCT.originalPrice) {
      return null;
    }
    const discount =
      100 - Math.round((PRODUCT.price / PRODUCT.originalPrice) * 100);
    return discount > 0 ? discount : null;
  }, []);
  const handleAddToCart = () => {
    navigate("/cart", {
      state: { from: "product-detail", productId: PRODUCT.id },
    });
  };
  const handleBuyNow = () => {
    navigate("/checkout", { state: { productId: PRODUCT.id, quantity: 1 } });
  };
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.3 && rating - fullStars < 0.8;
    const total = hasHalf ? fullStars + 1 : fullStars;
    for (let i = 0; i < fullStars; i += 1) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="size-4 fill-amber-400 text-amber-400"
        />,
      );
    }
    if (hasHalf) {
      stars.push(
        <StarHalf
          key="half"
          className="size-4 fill-amber-400 text-amber-400"
        />,
      );
    }
    for (let i = total; i < 5; i += 1) {
      stars.push(
        <StarOff key={`empty-${i}`} className="size-4 text-amber-200" />,
      );
    }
    return stars;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-100">
      {" "}
      <TopBar />{" "}
      <main className="mx-auto w-full max-w-6xl space-y-10 px-4 pb-20 pt-12 lg:px-6">
        {" "}
        <section className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          {" "}
          <span className="hover:text-purple-600">홈</span>{" "}
          <ChevronRight className="size-3 text-neutral-300" />{" "}
          <span className="hover:text-purple-600">디지털</span>{" "}
          <ChevronRight className="size-3 text-neutral-300" />{" "}
          <span className="hover:text-purple-600">오디오</span>{" "}
          <ChevronRight className="size-3 text-neutral-300" />{" "}
          <span className="font-semibold text-neutral-800">
            무선 이어폰
          </span>{" "}
        </section>{" "}
        <section className="grid gap-10 rounded-[32px] border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur lg:grid-cols-[minmax(0,1.05fr),minmax(0,1fr)] lg:p-10">
          {" "}
          <div className="space-y-6">
            {" "}
            <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-inner">
              {" "}
              <img
                src={activeImage.src}
                alt={activeImage.alt}
                className="w-full object-cover"
              />{" "}
              <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-neutral-600 shadow">
                {" "}
                {activeImage.caption}{" "}
              </div>{" "}
            </div>{" "}
            <div className="grid grid-cols-5 gap-3">
              {" "}
              {PRODUCT_IMAGES.map((image, index) => (
                <button
                  key={image.alt}
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative overflow-hidden rounded-2xl border transition ${index === activeImageIndex ? "border-purple-500 ring-2 ring-purple-200" : "border-neutral-200 hover:border-purple-300"}`}
                >
                  {" "}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-20 w-full object-cover transition duration-500 hover:scale-105"
                  />{" "}
                  {index === activeImageIndex && (
                    <span className="absolute bottom-2 right-2 rounded-full bg-purple-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      {" "}
                      대표{" "}
                    </span>
                  )}{" "}
                </button>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div className="space-y-6">
            {" "}
            <header className="space-y-2">
              {" "}
              <div className="flex items-center gap-2 text-sm text-purple-500">
                {" "}
                <BadgeCheck className="size-4" /> 네오보이스 공식 스토어{" "}
              </div>{" "}
              <div className="flex items-start justify-between gap-4">
                {" "}
                <div>
                  {" "}
                  <p className="text-sm font-semibold text-neutral-400">
                    {" "}
                    {PRODUCT.brand}{" "}
                  </p>{" "}
                  <h1 className="mt-1 text-3xl font-bold leading-snug text-neutral-900 lg:text-4xl">
                    {" "}
                    {PRODUCT.name}{" "}
                  </h1>{" "}
                  <p className="mt-2 text-sm text-neutral-500">
                    {" "}
                    {PRODUCT.tagline}{" "}
                  </p>{" "}
                </div>{" "}
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  {" "}
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full border border-neutral-200 transition hover:border-purple-300 hover:text-purple-600"
                  >
                    {" "}
                    <Share2 className="size-4" />{" "}
                  </button>{" "}
                  <button
                    type="button"
                    className="flex size-10 items-center justify-center rounded-full border border-neutral-200 transition hover:border-rose-300 hover:text-rose-500"
                  >
                    {" "}
                    <Heart className="size-4" />{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                {" "}
                <div className="flex items-center gap-1 text-amber-500">
                  {" "}
                  {renderStars(PRODUCT.rating)}{" "}
                </div>{" "}
                <span className="text-sm font-semibold text-neutral-900">
                  {" "}
                  {PRODUCT.rating.toFixed(1)}{" "}
                </span>{" "}
                <span>리뷰 {PRODUCT.reviewCount.toLocaleString()}개</span>{" "}
                <span className="text-neutral-300">•</span>{" "}
                <span>찜 {PRODUCT.likes.toLocaleString()}</span>{" "}
              </div>{" "}
            </header>{" "}
            <div className="space-y-4 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-emerald-50 p-6 shadow-inner">
              {" "}
              <div className="flex flex-wrap items-end gap-3">
                {" "}
                {discountLabel && (
                  <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white">
                    {" "}
                    {discountLabel}% OFF{" "}
                  </span>
                )}{" "}
                <div>
                  {" "}
                  <p className="text-xs text-neutral-400">행사 할인가</p>{" "}
                  <p className="text-3xl font-bold text-neutral-900 lg:text-[40px]">
                    {" "}
                    {formatCurrency(PRODUCT.price)}원{" "}
                  </p>{" "}
                </div>{" "}
                {PRODUCT.originalPrice && (
                  <p className="text-sm text-neutral-400 line-through">
                    {" "}
                    {formatCurrency(PRODUCT.originalPrice)}원{" "}
                  </p>
                )}{" "}
              </div>{" "}
              <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                {" "}
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-purple-600 shadow-sm">
                  {" "}
                  월 24,800원 (12개월 무이자){" "}
                </span>{" "}
                <span>•</span>{" "}
                <span>네이버페이 결제 시 최대 8,950P 적립</span>{" "}
              </div>{" "}
              <div className="flex flex-wrap gap-2">
                {" "}
                {BENEFIT_TAGS.map((benefit) => (
                  <span
                    key={benefit.label}
                    className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${benefit.tone === "brand" ? "bg-emerald-500/10 text-emerald-600" : benefit.tone === "purple" ? "bg-purple-500/10 text-purple-600" : "bg-sky-500/10 text-sky-600"}`}
                  >
                    {" "}
                    {benefit.label}{" "}
                  </span>
                ))}{" "}
              </div>{" "}
            </div>{" "}
            <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              {" "}
              <h2 className="text-sm font-semibold text-neutral-900">
                {" "}
                주요 특징{" "}
              </h2>{" "}
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                {" "}
                {PRODUCT.summaryPoints.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    {" "}
                    <span className="mt-1 size-1.5 rounded-full bg-purple-500" />{" "}
                    <span>{point}</span>{" "}
                  </li>
                ))}{" "}
              </ul>{" "}
            </div>{" "}
            <div className="grid gap-3 sm:grid-cols-3">
              {" "}
              {SERVICE_BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex flex-col gap-1 rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    {" "}
                    <span className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-500">
                      {" "}
                      <Icon className="size-5" />{" "}
                    </span>{" "}
                    <span className="font-semibold text-neutral-900">
                      {" "}
                      {badge.label}{" "}
                    </span>{" "}
                    <span>{badge.description}</span>{" "}
                  </div>
                );
              })}{" "}
            </div>{" "}
            <div className="grid gap-3 sm:grid-cols-[1.2fr,1fr,1fr]">
              {" "}
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-4 text-sm font-semibold text-neutral-600 transition hover:border-purple-300 hover:text-purple-600"
              >
                {" "}
                <Heart className="size-4" /> 찜 3,187{" "}
              </button>{" "}
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-6 py-4 text-sm font-semibold text-purple-600 transition hover:border-purple-300 hover:bg-purple-100"
              >
                {" "}
                <ShoppingBag className="size-4" /> 장바구니 담기{" "}
              </button>{" "}
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex items-center justify-center gap-2 rounded-full bg-purple-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-purple-500"
              >
                {" "}
                지금 구매 <ChevronRight className="size-4" />{" "}
              </button>{" "}
            </div>{" "}
            <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              {" "}
              <h2 className="text-sm font-semibold text-neutral-900">
                {" "}
                배송 · 혜택 안내{" "}
              </h2>{" "}
              <ul className="space-y-3">
                {" "}
                {DELIVERY_INFO.map((info) => {
                  const Icon = info.icon;
                  return (
                    <li
                      key={info.title}
                      className="flex items-start gap-3 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50/60 px-4 py-3"
                    >
                      {" "}
                      <span className="mt-1 flex size-9 items-center justify-center rounded-full bg-white text-purple-500 shadow-sm">
                        {" "}
                        <Icon className="size-4" />{" "}
                      </span>{" "}
                      <div className="flex-1 text-sm text-neutral-600">
                        {" "}
                        <p className="font-semibold text-neutral-900">
                          {" "}
                          {info.title}{" "}
                        </p>{" "}
                        <p className="mt-1">{info.description}</p>{" "}
                        <p className="mt-1 text-xs text-neutral-400">
                          {" "}
                          {info.footnote}{" "}
                        </p>{" "}
                      </div>{" "}
                    </li>
                  );
                })}{" "}
              </ul>{" "}
              <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-emerald-500 px-5 py-4 text-sm text-white shadow-sm">
                {" "}
                {PRODUCT.deliveryDate}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className="grid gap-6 rounded-[32px] border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur lg:grid-cols-[1.1fr,0.9fr] lg:p-10">
          {" "}
          <div className="space-y-6">
            {" "}
            <h2 className="text-xl font-semibold text-neutral-900">
              {" "}
              왜 네오보이스 이어버드 프로인가요?{" "}
            </h2>{" "}
            <div className="grid gap-4 md:grid-cols-3">
              {" "}
              {HIGHLIGHTS.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <article
                    key={highlight.title}
                    className="group flex h-full flex-col gap-3 rounded-3xl border border-neutral-200 bg-white p-5 text-sm text-neutral-600 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl"
                  >
                    {" "}
                    <span className="flex size-10 items-center justify-center rounded-full bg-purple-50 text-purple-500">
                      {" "}
                      <Icon className="size-5" />{" "}
                    </span>{" "}
                    <h3 className="font-semibold text-neutral-900">
                      {" "}
                      {highlight.title}{" "}
                    </h3>{" "}
                    <p className="leading-relaxed">
                      {highlight.description}
                    </p>{" "}
                  </article>
                );
              })}{" "}
            </div>{" "}
            <div className="rounded-3xl border border-neutral-200 bg-neutral-50/80 p-6">
              {" "}
              <h3 className="text-sm font-semibold text-neutral-900">
                {" "}
                상세 스펙{" "}
              </h3>{" "}
              <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm text-neutral-600 md:grid-cols-2">
                {" "}
                {SPECIFICATIONS.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-start justify-between gap-4 border-b border-dashed border-neutral-200 pb-3 last:border-none md:pb-4"
                  >
                    {" "}
                    <dt className="font-medium text-neutral-500">
                      {" "}
                      {spec.label}{" "}
                    </dt>{" "}
                    <dd className="text-right text-neutral-700">
                      {" "}
                      {spec.value}{" "}
                    </dd>{" "}
                  </div>
                ))}{" "}
              </dl>{" "}
            </div>{" "}
          </div>{" "}
          <div className="space-y-6">
            {" "}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              {" "}
              <div className="flex items-center justify-between">
                {" "}
                <h3 className="text-lg font-semibold text-neutral-900">
                  {" "}
                  구매자 리뷰 한눈에 보기{" "}
                </h3>{" "}
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
                  {" "}
                  만족도 4.8 / 5.0{" "}
                </span>{" "}
              </div>{" "}
              <div className="mt-5 space-y-4">
                {" "}
                {REVIEW_DISTRIBUTION.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    {" "}
                    <span className="w-8 text-sm text-neutral-500">
                      {" "}
                      {item.label}{" "}
                    </span>{" "}
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                      {" "}
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-500"
                        style={{ width: `${item.percent}%` }}
                      />{" "}
                    </div>{" "}
                    <span className="w-16 text-right text-sm text-neutral-400">
                      {" "}
                      {item.percent}%{" "}
                    </span>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
              <div className="mt-5 grid gap-4">
                {" "}
                {REVIEW_QUOTES.map((review) => (
                  <article
                    key={review.user}
                    className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 text-sm text-neutral-600 shadow-sm"
                  >
                    {" "}
                    <header className="flex items-center justify-between">
                      {" "}
                      <span className="font-semibold text-neutral-800">
                        {" "}
                        {review.title}{" "}
                      </span>{" "}
                      <span className="text-xs text-neutral-400">
                        {" "}
                        {review.user}{" "}
                      </span>{" "}
                    </header>{" "}
                    <p className="mt-2 leading-relaxed">{review.body}</p>{" "}
                    <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-purple-500 shadow-sm">
                      {" "}
                      <ThumbsUp className="size-3.5" /> {review.highlight}{" "}
                    </span>{" "}
                  </article>
                ))}{" "}
              </div>{" "}
              <button
                type="button"
                className="mt-6 w-full rounded-full border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-600 transition hover:border-purple-300 hover:text-purple-600"
              >
                {" "}
                전체 리뷰 1,264개 보기{" "}
              </button>{" "}
            </div>{" "}
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              {" "}
              <h3 className="text-lg font-semibold text-neutral-900">
                {" "}
                자주 묻는 질문{" "}
              </h3>{" "}
              <div className="mt-4 space-y-4">
                {" "}
                {QNA_ITEMS.map((item) => (
                  <article
                    key={item.question}
                    className="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 text-sm text-neutral-600"
                  >
                    {" "}
                    <div className="flex items-start gap-2 text-neutral-800">
                      {" "}
                      <span className="mt-0.5 text-purple-500">Q.</span>{" "}
                      <h4 className="font-semibold">{item.question}</h4>{" "}
                    </div>{" "}
                    <div className="mt-2 flex items-start gap-2">
                      {" "}
                      <span className="mt-0.5 text-emerald-500">A.</span>{" "}
                      <p className="leading-relaxed">{item.answer}</p>{" "}
                    </div>{" "}
                    <p className="mt-3 text-xs text-neutral-400">
                      {item.meta}
                    </p>{" "}
                  </article>
                ))}{" "}
              </div>{" "}
              <button
                type="button"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-600 transition hover:border-purple-300 hover:text-purple-600"
              >
                {" "}
                <MessageCircle className="size-4" /> 문의 남기기{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </section>{" "}
        <section className="space-y-6 rounded-[32px] border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur lg:p-10">
          {" "}
          <header className="flex items-center justify-between">
            {" "}
            <div>
              {" "}
              <h2 className="text-xl font-semibold text-neutral-900">
                {" "}
                함께 보면 좋은 구성{" "}
              </h2>{" "}
              <p className="mt-1 text-sm text-neutral-500">
                {" "}
                액세서리와 연동 기기를 동시에 장바구니에 담아보세요.{" "}
              </p>{" "}
            </div>{" "}
            <button
              type="button"
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-500 transition hover:border-purple-300 hover:text-purple-600"
            >
              {" "}
              모두 보기{" "}
            </button>{" "}
          </header>{" "}
          <div className="grid gap-5 md:grid-cols-3">
            {" "}
            {RECOMMENDED_PRODUCTS.map((product) => (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {" "}
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  {" "}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />{" "}
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-purple-600 shadow">
                    {" "}
                    BEST{" "}
                  </span>{" "}
                </div>{" "}
                <div className="flex flex-1 flex-col gap-3 p-5 text-sm text-neutral-600">
                  {" "}
                  <h3 className="text-base font-semibold text-neutral-900">
                    {" "}
                    {product.title}{" "}
                  </h3>{" "}
                  <div className="flex flex-wrap gap-2">
                    {" "}
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500"
                      >
                        {" "}
                        {tag}{" "}
                      </span>
                    ))}{" "}
                  </div>{" "}
                  <p className="text-lg font-semibold text-neutral-900">
                    {" "}
                    {formatCurrency(product.price)}원{" "}
                  </p>{" "}
                  <button
                    type="button"
                    className="mt-auto flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white py-3 text-sm font-semibold text-neutral-600 transition hover:border-purple-300 hover:text-purple-600"
                  >
                    {" "}
                    <ShoppingBag className="size-4" /> 함께 담기{" "}
                  </button>{" "}
                </div>{" "}
              </article>
            ))}{" "}
          </div>{" "}
        </section>{" "}
      </main>{" "}
    </div>
  );
}
