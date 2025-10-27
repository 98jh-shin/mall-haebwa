import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Heart } from "lucide-react";

const names = [
  "LED 초슬림 엣지 조명",
  "트위그뉴욕 테이블 매트",
  "몽게 구름방등 키즈 조명",
  "아쿠아 6문 옷장 세트",
  "현관 방풍 암막 커튼",
  "고급 아크릴 안내판",
  "벨벳 포근 극세사 이불",
  "감성 원목 노트북 테이블",
  "흑자 도자기 빈티지 접시",
  "자윤영디자인 소나무 원목 장난감 정리대",
  "미니멀 감성 러그",
  "데일리 홈카페 머그컵",
];

const descriptions = [
  "미세조도까지 세밀하게 조절되는 실내 조명입니다.",
  "다이닝 룸에 포인트를 주는 감성 식탁 매트 세트에요.",
  "아이 방을 따뜻하게 밝혀주는 귀여운 구름 디자인.",
  "대용량 수납이 가능한 슬라이딩 시스템을 채택했어요.",
  "호텔식 암막으로 사계절 쾌적한 공간을 만들어 보세요.",
  "고급스러운 사무실 안내판으로 방문객을 친절하게 맞이해요.",
  "부드러운 촉감과 뛰어난 보온성으로 겨울철 필수템!",
  "접이식이라 편하게 보관하며 원하는 곳에서 사용해요.",
  "감각적인 테이블 셋팅을 완성하는 데일리 아이템.",
  "아이 키 높이에 맞춘 안전한 정리대, 교육적인 공간 연출.",
  "포근한 텍스처와 세련된 색감으로 어느 공간이든 어울려요.",
  "트렌디한 컬러 조합으로 홈카페 분위기를 완성하세요.",
];

const imagePool = [
  "https://images.unsplash.com/photo-1703046598921-01b2b97bcafa?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1708388064278-707e85eaddc0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2ltY2hpfGVufDB8fDB8fHww&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1708388065149-1304dec1f0ec?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1706468238786-63e6a4c814eb?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTl8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1610602925036-1d81bb50065a?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTh8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1583224944844-5b268c057b72?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8a2ltY2hpfGVufDB8fHx8MTc2MTUzOTgzMnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2ltY2hpfGVufDB8fDB8fHww&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1604749484188-57386ff296db?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjB8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1616787928056-ae5ab4b649d8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8a2ltY2hpfGVufDB8fHx8MTc2MTUzOTgzMnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1644131447600-dcf173a37728?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTZ8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1698489857683-0d30f7f046f7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8a2ltY2hpfGVufDB8fHx8MTc2MTUzOTgzMnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
  "https://images.unsplash.com/photo-1699572583192-837d1b848cb7?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MjZ8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
];

const fallbackImage =
  "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2ltY2hpfGVufDB8fDB8fHww&auto=format&fit=crop&w=640&q=80";

const shippingOptions = ["무료배송", "3,000원", "착불 5,000원", "오늘출발"];
const badgeOptions = ["해외", "NEW", "인기", "단독", "특가", "AD"];

const numberFormatter = new Intl.NumberFormat("ko-KR");

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateProduct(id) {
  const basePrice = Math.floor(Math.random() * 400000) + 20000;
  const salePercent = Math.random() > 0.3 ? Math.floor(Math.random() * 50) + 10 : 0;
  const salePrice =
    salePercent > 0
      ? Math.round(basePrice * (1 - salePercent / 100) / 100) * 100
      : basePrice;

  const badgeCount = Math.random() > 0.6 ? 2 : Math.random() > 0.3 ? 1 : 0;
  const shuffledBadges = [...badgeOptions].sort(() => Math.random() - 0.5);

  return {
    id,
    title: pickRandom(names),
    subtitle: pickRandom(descriptions),
    image: pickRandom(imagePool),
    price: numberFormatter.format(basePrice),
    salePrice: numberFormatter.format(salePrice),
    salePercent,
    shipping: pickRandom(shippingOptions),
    liked: Math.random() > 0.7,
    badges: shuffledBadges.slice(0, badgeCount),
  };
}

function useInfiniteProducts(batchSize = 12) {
  const [products, setProducts] = useState(() =>
    Array.from({ length: batchSize }, (_, idx) => generateProduct(idx))
  );
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => {
    setProducts((prev) => {
      const offset = prev.length;
      const nextItems = Array.from({ length: batchSize }, (_, idx) =>
        generateProduct(offset + idx)
      );
      return [...prev, ...nextItems];
    });
    setPage((prev) => prev + 1);
  }, [batchSize]);

  return { products, loadMore, page };
}

function ProductBadge({ label }) {
  const styles = useMemo(
    () => ({
      해외: "bg-emerald-500/10 text-emerald-600",
      NEW: "bg-blue-500/10 text-blue-600",
      인기: "bg-rose-500/10 text-rose-600",
      단독: "bg-purple-500/10 text-purple-600",
      특가: "bg-orange-500/10 text-orange-600",
      AD: "bg-neutral-900 text-white",
    }),
    []
  );

  const className = styles[label] ?? "bg-neutral-200/70 text-neutral-600";

  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${className}`}>
      {label}
    </span>
  );
}

function ProductCard({ product }) {
  return (
    <article className="flex flex-col gap-3">
      <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <img
          src={product.image}
          alt={product.title}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.05]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
            event.currentTarget.onerror = null;
          }}
        />
        <button
          type="button"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-neutral-500 shadow-sm transition hover:text-rose-500"
          aria-label="찜하기"
        >
          <Heart
            className={`size-4 ${product.liked ? "fill-rose-500 text-rose-500" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex flex-wrap items-center gap-1">
          {product.badges.map((badge) => (
            <ProductBadge key={`${product.id}-${badge}`} label={badge} />
          ))}
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900">
          {product.title}
        </h3>
        <p className="line-clamp-2 text-xs text-neutral-500">
          {product.subtitle}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          {product.salePercent > 0 && (
            <span className="text-sm font-semibold text-rose-500">
              {product.salePercent}%
            </span>
          )}
          <span className="text-lg font-bold text-neutral-900">
            {product.salePrice}원
          </span>
        </div>
        {product.salePercent > 0 && (
          <span className="text-xs text-neutral-400 line-through">
            {product.price}원
          </span>
        )}
        <span className="text-xs text-neutral-500">배송 {product.shipping}</span>
      </div>
    </article>
  );
}

export default function ProductFeed() {
  const { products, loadMore, page } = useInfiniteProducts(12);
  const { ref, inView } = useInView({ rootMargin: "400px 0px" });

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-24 lg:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            인기 추천 상품
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            지금 사람들이 많이 보는 상품을 모아봤어요.
          </p>
        </div>
        <span className="text-xs text-neutral-400">
          자동 생성된 데모 데이터 · {page} 페이지
        </span>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={ref} className="mt-12 flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-500">
          더 많은 상품을 불러오는 중...
        </div>
      </div>
    </section>
  );
}
