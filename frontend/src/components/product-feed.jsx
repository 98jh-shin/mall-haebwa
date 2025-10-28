import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Heart, RefreshCw } from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const PAGE_SIZE = 12;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?auto=format&fit=crop&w=640&q=80";

const BADGE_STYLE_MAP = {
  해외: "bg-emerald-500/10 text-emerald-600",
  NEW: "bg-blue-500/10 text-blue-600",
  인기: "bg-rose-500/10 text-rose-600",
  단독: "bg-purple-500/10 text-purple-600",
  특가: "bg-orange-500/10 text-orange-600",
  AD: "bg-neutral-900 text-white",
  추천: "bg-emerald-500 text-white",
  "무료 배송": "bg-sky-500/10 text-sky-600",
  오늘출발: "bg-amber-500/10 text-amber-600",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("ko-KR").format(Number(value) || 0);

const deriveBadges = (product) => {
  if (Array.isArray(product.tags) && product.tags.length > 0) {
    return product.tags.slice(0, 3);
  }

  const badges = [];
  if (product.is_recommended) badges.push("추천");
  if (product.shipping) badges.push(product.shipping);
  return badges.slice(0, 3);
};

function ProductBadge({ label }) {
  const className = BADGE_STYLE_MAP[label] ?? "bg-neutral-200/70 text-neutral-600";
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${className}`}>
      {label}
    </span>
  );
}

function usePaginatedProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      if (loading) return;
      if (!hasMore && page !== 1) return;

      setLoading(true);
      setError(null);

      try {
        const url = new URL(`${API_BASE_URL}/products`);
        url.searchParams.set("page", String(page));
        url.searchParams.set("page_size", String(PAGE_SIZE));
        url.searchParams.set("recommended", "true");

        const response = await fetch(url.toString());
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload.detail || "상품 정보를 불러오지 못했습니다.");
        }

        if (cancelled) return;

        const incoming = Array.isArray(payload.items) ? payload.items : [];
        setProducts((prev) => {
          if (page === 1) {
            return incoming;
          }
          const existingIds = new Set(prev.map((item) => item.product_id));
          const deduped = incoming.filter(
            (item) => item && !existingIds.has(item.product_id),
          );
          return [...prev, ...deduped];
        });
        setHasMore(Boolean(payload.has_more));
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError.message || "상품 정보를 불러오지 못했습니다.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [page, retryCount]);

  const retry = () => {
    setRetryCount((prev) => prev + 1);
    setError(null);
  };

  return {
    products,
    page,
    setPage,
    hasMore,
    loading,
    error,
    retry,
  };
}

function ProductCard({ product }) {
  const badges = useMemo(() => deriveBadges(product), [product]);
  const salePrice = product.sale_price ?? null;
  const salePercent =
    salePrice && product.price && product.price > 0
      ? Math.round(((product.price - salePrice) / product.price) * 100)
      : 0;

  return (
    <article className="flex flex-col gap-3">
      <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
        <img
          src={product.thumbnail_url}
          alt={product.title}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.05]"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
            event.currentTarget.onerror = null;
          }}
        />
        <button
          type="button"
          className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/90 text-neutral-500 shadow-sm transition hover:text-rose-500"
          aria-label="찜하기"
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex flex-wrap items-center gap-1">
          {badges.map((badge) => (
            <ProductBadge key={`${product.product_id}-${badge}`} label={badge} />
          ))}
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-neutral-900">
          {product.title}
        </h3>
        {product.subtitle ? (
          <p className="line-clamp-2 text-xs text-neutral-500">
            {product.subtitle}
          </p>
        ) : null}
        <div className="mt-2 flex items-baseline gap-2">
          {salePercent > 0 ? (
            <span className="text-sm font-semibold text-rose-500">
              {salePercent}%
            </span>
          ) : null}
          <span className="text-lg font-bold text-neutral-900">
            {formatCurrency(salePrice ?? product.price)}원
          </span>
        </div>
        {salePercent > 0 ? (
          <span className="text-xs text-neutral-400 line-through">
            {formatCurrency(product.price)}원
          </span>
        ) : null}
        {product.shipping ? (
          <span className="text-xs text-neutral-500">
            배송 {product.shipping}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export default function ProductFeed() {
  const { products, page, setPage, hasMore, loading, error, retry } =
    usePaginatedProducts();
  const { ref, inView } = useInView({ rootMargin: "400px 0px" });
  const prevInView = useRef(false);

  useEffect(() => {
    if (inView && !prevInView.current && hasMore && !loading && !error) {
      setPage((prev) => prev + 1);
    }
    prevInView.current = inView;
  }, [inView, hasMore, loading, error, setPage]);

  const derivedPage = Math.max(1, Math.ceil(products.length / PAGE_SIZE)) || 1;

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
          데이터베이스 기반 추천 · {derivedPage} 페이지
        </span>
      </header>

      {error ? (
        <div className="mb-6 flex items-center justify-between rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          <span>{error}</span>
          <button
            type="button"
            onClick={retry}
            className="flex items-center gap-2 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold transition hover:border-rose-300 hover:text-rose-700"
          >
            <RefreshCw className="size-4" />
            다시 시도
          </button>
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>

      <div ref={ref} className="mt-12 flex justify-center">
        {loading ? (
          <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-500">
            더 많은 상품을 불러오는 중...
          </div>
        ) : !hasMore ? (
          <div className="flex items-center gap-2 rounded-full border border-neutral-100 bg-neutral-50 px-4 py-2 text-sm text-neutral-400">
            모든 추천 상품을 확인했어요.
          </div>
        ) : null}
      </div>
    </section>
  );
}
