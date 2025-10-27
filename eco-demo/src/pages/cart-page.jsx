import { useNavigate } from "react-router-dom";
import TopBar from "../components/topbar";
import { CheckCircle2, MapPin, ChevronRight, Trash2 } from "lucide-react";

const address = {
  label: "배송지: 집",
  detail: "서울특별시 중구 을지로 100 (을지로동) 10층",
  message: "등록한 배송지 기준 빠른배송 상품을 볼 수 있습니다.",
};

const cartItems = [
  {
    id: 1,
    store: "SwiftCart 장보기",
    isGiftable: false,
    title: "한돈 앞다리살 300g (김치찌개용)",
    option: "구성 : 앞다리살 300g · 손질 완료",
    amount: 12900,
    original: 15800,
    image:
      "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRbu7vVyUsTbaFnUhFJdAC2DYBfxesUkSFwaO0F-4-JNWddPddpddb0rbHWy8ReOMbW4jBx2dN7ElDziUw5xe8G9iDFjAw3bgfCSB6T9kpK2ecmjgCA8hpO&usqp=CAc",
    badges: ["빠른배송", "오늘출발"],
    discount: 18,
    shipping: "무료",
    shippingDesc: "오늘 18시 이전 주문 시 당일 발송",
  },
  {
    id: 2,
    store: "SwiftCart 프레시",
    isGiftable: false,
    title: "묵은지 김치 1kg",
    option: "구성 : 국물 포함 · 포기김치",
    amount: 9800,
    original: 12800,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSJ3V-VF_1Nkqp-cFibzlBzkqyI5egYmoHYPt0fy_koTp94nE_wk8bx24JCFQn2OtYCWfJyQlRVJt_KYoze8QKq3kWZbLmDES-PRnPPEirbRqIUNJ8aIFol&usqp=CAc",
    badges: ["pay"],
    discount: 23,
    shipping: "무료",
    shippingDesc: "N포인트 결제 시 추가 적립",
  },
  {
    id: 3,
    store: "SwiftCart 마켓",
    isGiftable: true,
    title: "육수 한알 사골육수 큐브 6입",
    option: "구성 : 15g × 6개 · 냉동보관",
    amount: 6900,
    original: 7900,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRN0yDfecWZvCEr4ExWagQq3ZSQD2AlD3tRTw&s",
    badges: ["빠른배송", "선물"],
    discount: 13,
    shipping: "3,000원",
    shippingDesc: "3만원 이상 구매 시 무료배송",
  },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80";

function formatCurrency(value) {
  return value.toLocaleString("ko-KR");
}

function CartItem({ item }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" aria-label="스토어 선택" />
          <h3 className="text-lg font-semibold text-neutral-900">
            {item.store}
          </h3>
        </div>
        <button className="text-sm font-semibold text-emerald-600 hover:underline">
          쿠폰받기
        </button>
      </header>

      <div className="grid gap-6 px-6 py-5 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="flex items-center gap-5">
          <input type="checkbox" aria-label="상품 선택" />
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
                event.currentTarget.onerror = null;
              }}
            />
          </div>
        </div>
        <div className="space-y-2 text-sm text-neutral-600">
          <div className="flex items-center gap-2">
            {item.isGiftable && (
              <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600">
                선물가능상품
              </span>
            )}
            {item.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-md bg-neutral-800 px-2 py-1 text-xs font-semibold text-white"
              >
                {badge}
              </span>
            ))}
          </div>

          <h4 className="text-base font-semibold text-neutral-900">
            {item.title}
          </h4>
          <p className="text-xs text-neutral-500">{item.option}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 hover:border-neutral-300">
              다른 옵션 보기
            </button>
            <button className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 hover:border-neutral-300">
              수량 변경
            </button>
            <button className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-500 hover:border-neutral-300">
              찜상품 담기
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-right text-sm">
          <div>
            <span className="text-sm font-semibold text-rose-500">
              {item.discount}%{" "}
              <span className="text-xs text-neutral-400 line-through">
                {formatCurrency(item.original)}원
              </span>
            </span>
            <p className="text-xl font-bold text-neutral-900">
              {formatCurrency(item.amount)}원
            </p>
          </div>

          <div className="text-xs text-neutral-500">
            <p className="font-medium text-neutral-900">배송비 {item.shipping}</p>
            <p>{item.shippingDesc}</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 hover:border-neutral-300">
              주문유형
            </button>
            <button className="inline-flex items-center justify-center rounded-full border border-emerald-500 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-100">
              주문하기
            </button>
          </div>

          <button className="flex items-center justify-end gap-1 text-xs text-neutral-400 hover:text-neutral-500">
            <Trash2 className="size-3.5" />
            선택 삭제
          </button>
        </div>
      </div>

      <footer className="grid gap-4 border-t border-neutral-200 px-6 py-5 text-sm text-neutral-600 md:grid-cols-4 md:text-center">
        <div className="flex items-center justify-between md:flex-col md:gap-1">
          <span className="text-neutral-500">선택상품금액</span>
          <span className="font-semibold text-neutral-900">0원</span>
        </div>
        <div className="flex items-center justify-between md:flex-col md:gap-1">
          <span className="text-neutral-500">총 배송비</span>
          <span className="font-semibold text-neutral-900">0원</span>
        </div>
        <div className="flex items-center justify-between md:flex-col md:gap-1">
          <span className="text-neutral-500">할인예상금액</span>
          <span className="font-semibold text-neutral-rose-500">0원</span>
        </div>
        <div className="flex items-center justify-between md:flex-col md:gap-1">
          <span className="text-neutral-500">주문금액</span>
          <span className="text-lg font-bold text-emerald-600">0원</span>
        </div>
      </footer>
    </div>
  );
}

const isKimchiSearchQuery = (value) => {
  const compact = value.replace(/\s+/g, "");
  const trimmed = compact.replace(/!+$/, "");
  return trimmed === "김치찌개";
};

export default function CartPage() {
  const navigate = useNavigate();

  const handleSearch = (query, category) => {
    const normalized = query.trim();
    const compact = normalized.replace(/\s+/g, "");
    const params = new URLSearchParams({
      query: normalized,
      category,
    });

    if (isKimchiSearchQuery(compact)) {
      navigate(`/search?${params.toString()}`);
    } else {
      navigate(`/chat?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopBar onSearch={handleSearch} />

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-10 lg:px-0">
        <header className="flex flex-col gap-2 pb-6">
          <h1 className="text-2xl font-semibold text-neutral-900">
            일반배송 {cartItems.length} · SwiftCart 프레시 · 지금배달 0
          </h1>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <MapPin className="size-5 text-emerald-500" />
            <div className="flex flex-col text-sm text-neutral-600">
              <span className="font-medium text-neutral-900">{address.label}</span>
              <span>{address.detail}</span>
              <span className="text-xs text-neutral-400">{address.message}</span>
            </div>

            <button className="ml-auto inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:border-neutral-300">
              변경하기 <ChevronRight className="size-3.5" />
            </button>
          </div>
        </header>

        <section className="mb-6 flex items-center justify-between text-sm text-neutral-600">
          <label className="inline-flex items-center gap-2 font-medium text-neutral-700">
            <input type="checkbox" />
            전체 선택
          </label>
          <button className="flex items-center gap-1 text-sm text-neutral-400 hover:text-neutral-600">
            선택 삭제 <Trash2 className="size-4" />
          </button>
        </section>

        <div className="space-y-6">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <section className="mt-12 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm text-sm text-neutral-600">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <CheckCircle2 className="size-5 text-emerald-500" />
            장바구니 안내
          </h2>
          <ul className="space-y-2 text-xs leading-relaxed text-neutral-500">
            <li>장바구니에 최대 200개의 상품을 담을 수 있습니다.</li>
            <li>장바구니 상품은 최대 90일간 저장됩니다.</li>
            <li>일부 상품은 옵션 선택 또는 주문수량에 따라 즉시 품절될 수 있습니다.</li>
            <li>오늘출발 상품은 한정 수량이므로 주문이 완료된 이후 품절될 수 있습니다.</li>
            <li>할인/쿠폰은 주문 단계에서 적용 가능합니다.</li>
          </ul>
        </section>
      </main>

      <footer className="sticky bottom-0 mt-auto border-t border-neutral-200 bg-neutral-900 text-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-0">
          <div className="text-sm text-neutral-300">
            총{" "}
            <span className="font-semibold text-white">
              {cartItems.length}건 주문금액 {formatCurrency(0)}원
            </span>
          </div>
          <div className="flex gap-3">
            <button className="w-full rounded-full border border-emerald-400 bg-neutral-900 px-6 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-neutral-800 lg:w-auto">
              선물하기
            </button>
            <button className="w-full rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-emerald-400 lg:w-auto">
              주문하기
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
