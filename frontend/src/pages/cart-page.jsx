import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/topbar";
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { AUTH_EVENT, getAccessToken, getUserId } from "../utils/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const address = {
  label: "기본배송지: 집",
  detail: "서울특별시 중구 세종대로 100 (태평로1가) 10층",
  message: "배송지를 변경하면 배송 가능한 상품만 표시됩니다.",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80";

function formatCurrency(value) {
  const numeric = Number.isFinite(value) ? value : Number(value || 0);
  return numeric.toLocaleString("ko-KR");
}

function getUnitPrice(item) {
  if (!item?.product) return 0;
  const sale = item.product.sale_price;
  const regular = item.product.price;
  if (typeof sale === "number") return sale;
  if (typeof sale === "string") return Number(sale) || 0;
  if (typeof regular === "number") return regular;
  if (typeof regular === "string") return Number(regular) || 0;
  return 0;
}

function CartItemRow({ item, onIncrease, onDecrease, onRemove, saving }) {
  const product = item.product ?? {};
  const thumbnail = product.thumbnail_url || fallbackImage;
  const hasSale =
    product.sale_price !== null &&
    product.sale_price !== undefined &&
    Number(product.sale_price) < Number(product.price ?? product.sale_price);
  const unitPrice = getUnitPrice(item);
  const totalPrice = unitPrice * item.quantity;

  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
            <img
              src={thumbnail}
              alt={product.title ?? "상품 이미지"}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = fallbackImage;
                event.currentTarget.onerror = null;
              }}
            />
          </div>
          <div className="space-y-2 text-sm text-neutral-600">
            <h3 className="text-base font-semibold text-neutral-900">
              {product.title ?? item.product_id}
            </h3>
            {product.subtitle ? (
              <p className="text-xs text-neutral-500">{product.subtitle}</p>
            ) : null}
            <p className="text-xs text-neutral-400">
              상품 ID {item.product_id}
            </p>
            {product.category ? (
              <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-semibold text-neutral-500">
                {product.category}
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={onDecrease}
            disabled={saving || item.quantity <= 1}
            className="flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700 disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-300"
            aria-label="수량 감소">
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-neutral-900">
            {item.quantity}
          </span>
          <button
            type="button"
            onClick={onIncrease}
            disabled={saving}
            className="flex size-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700 disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-300"
            aria-label="수량 증가">
            <Plus className="size-4" />
          </button>
        </div>
        <div className="text-right text-sm text-neutral-500">
          <p className="text-lg font-semibold text-neutral-900">
            {formatCurrency(totalPrice)}원
          </p>
          {hasSale ? (
            <p className="text-xs text-neutral-400 line-through">
              {formatCurrency(product.price)}원
            </p>
          ) : null}
        </div>
      </div>
      <footer className="mt-4 flex items-center justify-end">
        <button
          type="button"
          onClick={onRemove}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700 disabled:cursor-not-allowed disabled:border-neutral-100 disabled:text-neutral-300">
          <Trash2 className="size-4" />
          삭제하기
        </button>
      </footer>
    </article>
  );
}

const isKimchiSearchQuery = (value) => {
  const compact = value.replace(/\s+/g, "");
  const trimmed = compact.replace(/!+$/, "");
  return trimmed === "김치추천";
};

export default function CartPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => ({
    userId: getUserId(),
    token: getAccessToken(),
  }));
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const userId = session.userId;
  const token = session.token;

  useEffect(() => {
    const syncSession = () => {
      setSession({
        userId: getUserId(),
        token: getAccessToken(),
      });
    };
    window.addEventListener(AUTH_EVENT, syncSession);
    return () => window.removeEventListener(AUTH_EVENT, syncSession);
  }, []);

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          "X-User-Id": userId,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        setItems([]);
        setError("세션이 만료되었습니다. 다시 로그인해주세요.");
        return;
      }

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          payload.detail || "장바구니를 불러오지 못했습니다.",
        );
      }

      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  const persistCart = useCallback(
    async (nextItems) => {
      if (!userId) {
        setError("로그인 후 장바구니를 이용할 수 있습니다.");
        return;
      }

      setSaving(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": userId,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            items: nextItems.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
            })),
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(
            payload.detail || "장바구니를 저장하는 중 문제가 발생했습니다.",
          );
        }

        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (requestError) {
        setError(
          requestError.message ||
            "장바구니를 저장하는 중 문제가 발생했습니다.",
        );
      } finally {
        setSaving(false);
      }
    },
    [token, userId],
  );

  const handleIncrease = useCallback(
    (productId) => {
      const current = items.find((item) => item.product_id === productId);
      if (!current) return;
      const nextItems = items.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      void persistCart(nextItems);
    },
    [items, persistCart],
  );

  const handleDecrease = useCallback(
    (productId) => {
      const current = items.find((item) => item.product_id === productId);
      if (!current) return;
      const nextQuantity = current.quantity - 1;
      if (nextQuantity <= 0) {
        void persistCart(items.filter((item) => item.product_id !== productId));
      } else {
        const nextItems = items.map((item) =>
          item.product_id === productId
            ? { ...item, quantity: nextQuantity }
            : item,
        );
        void persistCart(nextItems);
      }
    },
    [items, persistCart],
  );

  const handleRemove = useCallback(
    (productId) => {
      void persistCart(items.filter((item) => item.product_id !== productId));
    },
    [items, persistCart],
  );

  const summary = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        acc.distinct += 1;
        acc.quantity += item.quantity;
        acc.subtotal += getUnitPrice(item) * item.quantity;
        return acc;
      },
      { distinct: 0, quantity: 0, subtotal: 0 },
    );
  }, [items]);

  const handleSearch = useCallback(
    (query, category) => {
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
    },
    [navigate],
  );

  const isAuthenticated = Boolean(userId);
  const cartIsEmpty = !items.length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopBar onSearch={handleSearch} />

      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-10 lg:px-0">
        <header className="flex flex-col gap-2 pb-6">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <h1 className="text-2xl font-semibold text-neutral-900">
              일반배송 {summary.distinct} · SwiftCart 프레시 · 담은 수량 {summary.quantity}
            </h1>
            {saving ? (
              <Loader2 className="size-4 animate-spin text-emerald-500" />
            ) : null}
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-sm">
            <MapPin className="size-5 text-emerald-500" />
            <div className="flex flex-col text-sm text-neutral-600">
              <span className="font-medium text-neutral-900">{address.label}</span>
              <span>{address.detail}</span>
              <span className="text-xs text-neutral-400">{address.message}</span>
            </div>

            <button className="ml-auto inline-flex items-center gap-1 rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition hover:border-neutral-300">
              변경하기 <ChevronRight className="size-3.5" />
            </button>
          </div>
        </header>

        {error ? (
          <div className="mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
            {error}
          </div>
        ) : null}

        {!isAuthenticated ? (
          <section className="mb-6 rounded-3xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600 shadow-sm">
            <p className="text-neutral-800">
              로그인 후 장바구니를 이용할 수 있습니다.
            </p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-emerald-400">
              로그인하러 가기
              <ChevronRight className="size-4" />
            </button>
          </section>
        ) : null}

        <section className="mb-6 flex items-center justify-between text-sm text-neutral-600">
          <label className="inline-flex items-center gap-2 font-medium text-neutral-700">
            <input type="checkbox" disabled />
            전체 선택
          </label>
          <button
            type="button"
            onClick={() => void persistCart([])}
            disabled={saving || cartIsEmpty}
            className="flex items-center gap-1 text-sm text-neutral-400 transition hover:text-neutral-600 disabled:cursor-not-allowed disabled:text-neutral-300">
            전체 삭제 <Trash2 className="size-4" />
          </button>
        </section>

        <div className="space-y-6">
          {loading ? (
            <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500 shadow-sm">
              <Loader2 className="mx-auto mb-2 size-6 animate-spin text-emerald-500" />
              장바구니를 불러오는 중입니다...
            </div>
          ) : cartIsEmpty ? (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500 shadow-sm">
              장바구니가 비어 있습니다. 원하는 상품을 추가해보세요!
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.product_id}
                item={item}
                onIncrease={() => handleIncrease(item.product_id)}
                onDecrease={() => handleDecrease(item.product_id)}
                onRemove={() => handleRemove(item.product_id)}
                saving={saving}
              />
            ))
          )}
        </div>

        <section className="mt-12 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm text-sm text-neutral-600">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-900">
            <CheckCircle2 className="size-5 text-emerald-500" />
            장바구니 안내
          </h2>
          <ul className="space-y-2 text-xs leading-relaxed text-neutral-500">
            <li>장바구니에는 최대 200종의 상품을 담을 수 있습니다.</li>
            <li>담은 상품은 최대 90일까지 유지됩니다.</li>
            <li>일부 상품은 재고 부족 또는 판매 종료 시 자동으로 제외될 수 있습니다.</li>
            <li>신선식품은 배송 희망일을 선택하면 더욱 빠르게 받아보실 수 있습니다.</li>
            <li>장바구니 금액은 주문 시점의 가격과 다를 수 있습니다.</li>
          </ul>
        </section>
      </main>

      <footer className="sticky bottom-0 mt-auto border-t border-neutral-200 bg-neutral-900 text-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-0">
          <div className="text-sm text-neutral-300">
            총{" "}
            <span className="font-semibold text-white">
              {summary.quantity}개 · 주문금액 {formatCurrency(summary.subtotal)}원
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full rounded-full border border-emerald-400 bg-neutral-900 px-6 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-neutral-800 lg:w-auto">
              계속 쇼핑하기
            </button>
            <button
              type="button"
              disabled={cartIsEmpty || saving || !isAuthenticated}
              className="w-full rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-300 lg:w-auto">
              주문하기
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

