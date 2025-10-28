import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  MapPin,
  ChevronRight,
  Star,
  ShoppingCart,
  BadgeCheck,
} from "lucide-react";
import TopBar from "../components/topbar";
import ChatSuggestionFeed from "../components/chat-suggestion-feed";

const fallbackImage =
  "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2ltY2hpfGVufDB8fDB8fHww&auto=format&fit=crop&w=640&q=80";

const quickFilters = [
  "추천순",
  "낮은 가격순",
  "높은 가격순",
  "판매 많은순",
  "리뷰 많은순",
  "신상품순",
];

const filterSections = [
  {
    title: "공통 ▸ 추천",
    options: [
      "공식인증",
      "무료배송",
      "배송비 포함",
      "★ 4.8 이상",
      "SwiftCart 멤버십",
    ],
  },
  {
    title: "공통 ▸ 빠른배송",
    options: ["SwiftCart 빠르게 받기", "오늘출발"],
  },
  {
    title: "행사",
    options: ["SwiftCart 멤버십"],
  },
  {
    title: "가격",
    options: ["2만원 이하", "2만원 ~ 4만원", "4만원 ~ 8만원", "8만원 이상"],
  },
  {
    title: "혜택",
    options: ["무료교환반품"],
  },
  {
    title: "카테고리",
    options: ["밀키트", "간편식", "식재료", "육류"],
  },
];

const featuredProducts = [
  {
    title: "[밀키트] 흥닭 김치찌개 요리재료 350G",
    brand: "SwiftCart 지금배송",
    price: "5,590원",
    rating: 4.89,
    reviewCount: 28,
    coupon: null,
    image:
      "https://images.unsplash.com/photo-1610602925036-1d81bb50065a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTh8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    badges: ["지금배송"],
  },
  {
    title: "프레시킷 캠핑 포차 김치어묵 우동전골 2인분",
    brand: "프레시킷",
    price: "12,400원",
    originalPrice: "18,900원",
    discount: "34%",
    coupon: "3,000원 쿠폰",
    rating: 4.87,
    reviewCount: 1023,
    image:
      "https://images.unsplash.com/photo-1708388064278-707e85eaddc0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2ltY2hpfGVufDB8fDB8fHww&auto=format&fit=crop&w=400&q=80",
    badges: ["공식", "적립", "빠른배송"],
  },
  {
    title: "식당전용 오모가리 김치찌개 무료레시피 제공",
    brand: "채움당 식품",
    price: "99,000원",
    originalPrice: "121,700원",
    discount: "18%",
    rating: 4.82,
    reviewCount: 28,
    image:
      "https://images.unsplash.com/photo-1706468238786-63e6a4c814eb?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    badges: ["무료배송"],
  },
  {
    title: "호양대디자인 롯데푸드 런천미트 갈릭라우 쉬운조리",
    brand: "롯데푸드추천",
    price: "28,340원",
    originalPrice: "35,430원",
    discount: "20%",
    coupon: null,
    rating: 4.9,
    reviewCount: 13307,
    image:
      "https://images.unsplash.com/photo-1699572583192-837d1b848cb7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjZ8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    badges: ["무료배송"],
  },
];

const productResults = [
  {
    title: "육수 한알 사골큐브 1.81kg 부대찌개/김치찌개",
    brand: "율문푸드",
    price: "22,700원",
    shipping: "3,000원",
    discount: "10%",
    image:
      "https://images.unsplash.com/photo-1703046598921-01b2b97bcafa?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    rating: 5.0,
    reviewCount: 51,
  },
  {
    title: "whatsotv 국내산 한돈 돼지고기 캠핑용 진한 찌개세트",
    brand: "whatsotv",
    price: "17,500원",
    shipping: "3,000원",
    discount: null,
    image:
      "https://images.unsplash.com/photo-1583224944844-5b268c057b72?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8a2ltY2hpfGVufDB8fHx8MTc2MTUzOTgzMnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    rating: 4.87,
    reviewCount: 312,
  },
  {
    title: "식자재 더하기 왕만두 김치찌개 재료 1.25kg",
    brand: "식자재 더하기",
    price: "8,600원",
    shipping: "무료배송",
    discount: "28%",
    image:
      "https://images.unsplash.com/photo-1708388065149-1304dec1f0ec?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    rating: 4.73,
    reviewCount: 671,
  },
  {
    title: "황금비율 김치찌개 육수 400g 3팩",
    brand: "SwiftCart 프레시",
    price: "9,900원",
    shipping: "무료배송",
    discount: "25%",
    image:
      "https://images.unsplash.com/photo-1616787928056-ae5ab4b649d8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8a2ltY2hpfGVufDB8fHx8MTc2MTUzOTgzMnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=400&q=80",
    rating: 4.91,
    reviewCount: 128,
  },
];

const isKimchiSearchQuery = (query) => {
  const compact = query.replace(/\s+/g, "");
  const trimmed = compact.replace(/!+$/, "");
  return trimmed === "김치찌개";
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const query = params.get("query")?.trim() || "김치찌개";
  const category = params.get("category") || "전체";

  const handleSearch = (nextQuery, nextCategory) => {
    const normalized = nextQuery.trim();
    const compact = normalized.replace(/\s+/g, "");

    if (isKimchiSearchQuery(compact)) {
      const searchParams = new URLSearchParams({
        query: normalized,
        category: nextCategory,
      });
      navigate(`/search?${searchParams.toString()}`);
    } else {
      const searchParams = new URLSearchParams({
        query: normalized,
        category: nextCategory,
      });
      navigate(`/chat?${searchParams.toString()}`);
    }
  };

  const chips = useMemo(
    () =>
      quickFilters.map((label) => ({
        label,
        active: label === "추천순",
      })),
    []
  );

  return (
    <div className="min-h-screen bg-neutral-100">
      <TopBar onSearch={handleSearch} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 lg:px-0">
        <header className="flex flex-col gap-3 rounded-3xl bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            {chips.map((chip) => (
              <button
                key={chip.label}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  chip.active
                    ? "bg-emerald-500 text-neutral-900"
                    : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 font-medium text-neutral-700">
              <MapPin className="size-4 text-emerald-500" />
              전 (서울 중구 기준)
              <ChevronRight className="size-4 text-neutral-400" />
            </span>
            <span className="text-xs text-neutral-400">
              현재 검색어:{" "}
              <strong className="text-neutral-700">{query}</strong> · 카테고리{" "}
              <strong className="text-neutral-700">{category}</strong>
            </span>
          </div>
        </header>

        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden h-fit rounded-3xl bg-white p-5 shadow-sm lg:block">
            {filterSections.map((section) => (
              <div key={section.title} className="mb-6 last:mb-0">
                <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                  {section.title}
                </h3>
                <ul className="space-y-2 text-sm text-neutral-600">
                  {section.options.map((option) => (
                    <li key={option}>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span>{option}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <section className="space-y-6">
            <div className="grid gap-4 rounded-3xl bg-white p-5 shadow-sm lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <article
                  key={product.title}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                        event.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-4 py-3 text-sm text-neutral-600">
                    <span className="text-xs font-semibold text-emerald-600">
                      {product.brand}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {product.title}
                    </h3>
                    <div className="mt-auto flex flex-col gap-1">
                      <div className="flex items-baseline gap-2">
                        {product.discount && (
                          <span className="text-sm font-semibold text-rose-500">
                            {product.discount}
                          </span>
                        )}
                        <span className="text-lg font-bold text-neutral-900">
                          {product.price}
                        </span>
                      </div>
                      {product.originalPrice && (
                        <span className="text-xs text-neutral-400 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                      {product.coupon && (
                        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-violet-100 px-2 py-1 text-[11px] font-semibold text-violet-600">
                          <BadgeCheck className="size-3" />
                          {product.coupon}
                        </span>
                      )}
                      <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                        <Star className="size-3.5 text-amber-400" />
                        <span className="font-semibold text-neutral-700">
                          {product.rating}
                        </span>
                        <span>· 리뷰 {product.reviewCount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {product.badges?.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-600"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <header className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-900">
                  전체 판매자 상품
                </h2>
                <button className="text-xs font-semibold text-emerald-600 hover:underline">
                  필터 초기화
                </button>
              </header>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {productResults.map((product) => (
                  <article
                    key={product.title}
                    className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src = fallbackImage;
                          event.currentTarget.onerror = null;
                        }}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 px-4 py-3 text-sm text-neutral-600">
                      <span className="text-xs font-semibold text-neutral-400">
                        {product.brand}
                      </span>
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {product.title}
                      </h3>
                      <div className="mt-auto flex flex-col gap-1">
                        <div className="flex items-baseline gap-2">
                          {product.discount && (
                            <span className="text-sm font-semibold text-rose-500">
                              {product.discount}
                            </span>
                          )}
                          <span className="text-lg font-bold text-neutral-900">
                            {product.price}
                          </span>
                        </div>
                        <span className="text-xs text-neutral-500">
                          배송비 {product.shipping}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-neutral-400">
                          <Star className="size-3.5 text-amber-400" />
                          <span className="font-semibold text-neutral-700">
                            {product.rating.toFixed(2)}
                          </span>
                          <span>· 리뷰 {product.reviewCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 text-xs">
                      <button className="inline-flex items-center gap-1 rounded-full border border-emerald-500 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-600 transition hover:bg-emerald-100">
                        <ShoppingCart className="size-3.5" />
                        장바구니
                      </button>
                      <button className="text-neutral-400 hover:text-neutral-600">
                        찜하기
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <ChatSuggestionFeed topic={query} />
      </main>
    </div>
  );
}
