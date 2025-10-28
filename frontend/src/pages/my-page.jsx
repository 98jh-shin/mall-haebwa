import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Truck,
  ShoppingCart,
  MessageCircle,
  Heart,
  Clock,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import TopBar from "../components/topbar";
import { getAccessToken, getUserId } from "../utils/auth";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const FILTER_BLUEPRINT = [
  { key: "total", label: "전체" },
  { key: "shipping", label: "배송중" },
  { key: "delivered", label: "배송완료" },
  { key: "cancelled", label: "취소/반품" },
];
const STATUS_LABEL_MAP = {
  pending: "주문 접수",
  processing: "상품 준비중",
  shipped: "배송중",
  delivered: "배송 완료",
  cancelled: "취소됨",
  returned: "반품됨",
};
const STATUS_TONE_MAP = {
  delivered: "brand",
  shipped: "sky",
  processing: "sky",
  pending: "sky",
  cancelled: "gray",
  returned: "gray",
};
const STATUS_MESSAGE_MAP = {
  pending: "주문이 접수되었습니다.",
  processing: "상품을 준비하고 있습니다.",
  shipped: "배송이 진행 중입니다.",
  delivered: "배송이 완료되었습니다.",
  cancelled: "주문이 취소되었습니다.",
  returned: "반품이 처리되었습니다.",
};
const DEFAULT_ORDER_IMAGE =
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=400&q=80";
function formatCurrency(value) {
  return new Intl.NumberFormat("ko-KR").format(value);
}
function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
}
function formatDateLabel(value) {
  if (!value) return "최근 주문 기록이 없습니다.";
  const date = new Date(value);
  if (Number.isNaN(date.getTime()))
    return "최근 주문 정보를 불러올 수 없습니다.";
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd} 주문`;
}
function SummaryMetric({ metric }) {
  const Icon = metric.icon;
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300">
      {" "}
      <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
        {" "}
        <Icon className="size-5" />{" "}
      </span>{" "}
      <div className="flex-1">
        {" "}
        <p className="text-xs font-semibold text-neutral-500">
          {metric.label}
        </p>{" "}
        <div className="mt-1 flex items-end gap-2 text-neutral-900">
          {" "}
          <span className="text-xl font-semibold">{metric.value}</span>{" "}
          <span className="text-xs text-emerald-500">
            {metric.description}
          </span>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
function OrderCard({ order }) {
  const tone =
    {
      brand: "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-100",
      sky: "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-100",
      gray: "bg-neutral-100 text-neutral-600 ring-1 ring-inset ring-neutral-200",
    }[order.statusTone] ?? "bg-neutral-100 text-neutral-600 ring-neutral-200";
  return (
    <article className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {" "}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        {" "}
        <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-inner md:w-32">
          {" "}
          <img
            src={order.image}
            alt={order.title}
            className="h-full w-full object-cover"
          />{" "}
        </div>{" "}
        <div className="flex-1 space-y-4">
          {" "}
          <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            {" "}
            <div>
              {" "}
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                {" "}
                <span>{order.id}</span> <span>•</span>{" "}
                <span>{order.orderedAt}</span>{" "}
              </div>{" "}
              <h2 className="mt-1 text-lg font-semibold text-neutral-900">
                {" "}
                {order.title}{" "}
              </h2>{" "}
              <p className="text-sm text-neutral-500">{order.option}</p>{" "}
            </div>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${tone}`}
              >
                {" "}
                {order.status}{" "}
              </span>{" "}
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">
                {" "}
                {order.paymentBadge}{" "}
              </span>{" "}
            </div>{" "}
          </header>{" "}
          <div className="flex flex-col gap-2 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
            {" "}
            <p className="font-semibold text-neutral-900">
              {" "}
              {formatCurrency(order.price)}원{" "}
            </p>{" "}
            <p>판매자 : {order.seller}</p>{" "}
            <p className="text-emerald-500">{order.deliveryMessage}</p>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <footer className="mt-6 flex flex-wrap gap-2">
        {" "}
        <button className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-semibold text-neutral-600 hover:border-neutral-300">
          {" "}
          <ShoppingCart className="size-4" /> 다시 구매{" "}
        </button>{" "}
        <button className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-xs font-semibold text-neutral-600 hover:border-neutral-300">
          {" "}
          <MessageCircle className="size-4" /> 문의하기{" "}
        </button>{" "}
      </footer>{" "}
    </article>
  );
}
function ProductPreviewCard({ product }) {
  return (
    <article className="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white/70 p-3 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg">
      {" "}
      <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-neutral-100">
        {" "}
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />{" "}
      </div>{" "}
      <div className="flex-1">
        {" "}
        <h3 className="text-sm font-semibold text-neutral-900 line-clamp-2">
          {" "}
          {product.title}{" "}
        </h3>{" "}
        <p className="mt-1 text-sm font-semibold text-emerald-600">
          {" "}
          {formatCurrency(product.price)}원{" "}
        </p>{" "}
      </div>{" "}
      <button
        type="button"
        className="size-9 rounded-full border border-neutral-200 text-neutral-500 transition hover:border-emerald-400 hover:text-emerald-500"
      >
        {" "}
        <Heart className="mx-auto size-4" />{" "}
      </button>{" "}
    </article>
  );
}
export default function MyPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      setError("로그인 후 이용해주세요.");
      setLoading(false);
      return;
    }
    const token = getAccessToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const controller = new AbortController();
    const fetchJson = async (url) => {
      const response = await fetch(url, { headers, signal: controller.signal });
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || "데이터를 불러오지 못했습니다.");
      }
      return response.json();
    };
    Promise.all([
      fetchJson(`${API_BASE_URL}/orders/my_page?user_id=${userId}`),
      fetchJson(`${API_BASE_URL}/orders/order_list?user_id=${userId}`),
    ])
      .then(([profileData, orderList]) => {
        setProfile(profileData);
        setOrders(orderList ?? []);
        setError(null);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message || "데이터를 불러오지 못했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
    return () => controller.abort();
  }, []);
  const orderStats = profile?.order_stats;
  const statusCounts = useMemo(() => {
    if (orderStats) {
      return {
        total: orderStats.total_orders,
        shipping: orderStats.shipping,
        delivered: orderStats.delivered,
        cancelled: orderStats.cancelled,
      };
    }
    return orders.reduce(
      (acc, order) => {
        acc.total += 1;
        if (["pending", "processing", "shipped"].includes(order.status)) {
          acc.shipping += 1;
        }
        if (order.status === "delivered") {
          acc.delivered += 1;
        }
        if (["cancelled", "returned"].includes(order.status)) {
          acc.cancelled += 1;
        }
        return acc;
      },
      { total: 0, shipping: 0, delivered: 0, cancelled: 0 },
    );
  }, [orderStats, orders]);
  const filters = useMemo(() => {
    return FILTER_BLUEPRINT.map((item, index) => ({
      ...item,
      badge: statusCounts[item.key] ?? 0,
      active: index === 0,
    }));
  }, [statusCounts]);
  const summaryMetrics = useMemo(() => {
    const stats = orderStats ?? {
      total_orders: orders.length,
      shipping: statusCounts.shipping ?? 0,
      delivered: statusCounts.delivered ?? 0,
      last_order_at: orders[0]?.placed_at ?? null,
    };
    const paymentMethods = profile?.payment_methods ?? [];
    const address = profile?.default_address;
    return [
      {
        label: "총 주문 건수",
        value: `${stats.total_orders}건`,
        description: formatDateLabel(stats.last_order_at),
        icon: Calendar,
      },
      {
        label: "배송 추적중",
        value: `${stats.shipping ?? 0}건`,
        description: `배송 완료 ${stats.delivered ?? 0}건`,
        icon: Truck,
      },
      {
        label: "결제 · 배송 설정",
        value: `${paymentMethods.length}개 결제수단`,
        description: address
          ? "기본 배송지 등록 완료"
          : "기본 배송지를 등록해주세요",
        icon: ShieldCheck,
      },
    ];
  }, [orderStats, orders, statusCounts, profile]);
  const orderCards = useMemo(() => {
    return orders.map((order) => {
      const statusKey = order.status || "pending";
      return {
        id: order.order_id,
        orderedAt: formatDateTime(order.placed_at),
        status: STATUS_LABEL_MAP[statusKey] ?? statusKey,
        statusTone: STATUS_TONE_MAP[statusKey] ?? "gray",
        title: `주문 번호 ${order.order_id}`,
        option: `총 결제 금액 ${formatCurrency(order.total_price || 0)}원`,
        image: DEFAULT_ORDER_IMAGE,
        price: order.total_price || 0,
        paymentBadge: "SwiftCart Pay",
        seller: "SwiftCart",
        deliveryMessage:
          STATUS_MESSAGE_MAP[statusKey] ?? "주문이 처리되었습니다.",
      };
    });
  }, [orders]);
  const userName = useMemo(() => {
    const name = profile?.full_name?.trim();
    return name && name.length > 0 ? name : "SwiftCart 회원";
  }, [profile]);
  const wishlistProducts = (profile?.wishlist ?? []).map((item) => ({
    product_id: item.product_id,
    title: item.title,
    price: item.price,
    image: item.image ?? DEFAULT_ORDER_IMAGE,
  }));
  const recentProducts = (profile?.recent_products ?? []).map((item) => ({
    product_id: item.product_id,
    title: item.title,
    price: item.price,
    image: item.image ?? DEFAULT_ORDER_IMAGE,
  }));
  const handleSearch = (keyword) => {
    const value = keyword.trim();
    if (!value) return;
    const params = new URLSearchParams({ keyword: value });
    if (value.includes("주문")) {
      navigate(`/search?${params.toString()}`);
    } else if (value.includes("상품")) {
      navigate(`/search?${params.toString()}`);
    } else {
      navigate(`/chat?${params.toString()}`);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-neutral-100">
      {" "}
      <TopBar onSearch={handleSearch} />{" "}
      <main className="mx-auto w-full max-w-5xl space-y-8 px-4 pb-16 pt-12">
        {" "}
        <section className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur">
          {" "}
          <header className="flex flex-wrap items-start justify-between gap-4">
            {" "}
            <div>
              {" "}
              <p className="text-xs font-semibold text-emerald-500">
                {" "}
                {userName}님의 쇼핑 리포트{" "}
              </p>{" "}
              <h1 className="mt-1 text-2xl font-bold text-neutral-900">
                {" "}
                주문 / 배송 현황{" "}
              </h1>{" "}
              <p className="mt-2 text-sm text-neutral-500">
                {" "}
                최근 주문과 배송 상태, 결제 수단을 한눈에 확인하세요.{" "}
              </p>{" "}
            </div>{" "}
            <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-500 focus-within:border-emerald-400 focus-within:bg-white">
              {" "}
              <Search className="size-4 text-neutral-400" />{" "}
              <input
                type="search"
                placeholder="주문번호나 상품명을 검색해보세요"
                className="w-full flex-1 bg-transparent text-sm text-neutral-700 focus:outline-none"
              />{" "}
              <button
                type="button"
                className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                {" "}
                검색{" "}
              </button>{" "}
            </div>{" "}
          </header>{" "}
          {loading && (
            <div className="mt-6 rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
              {" "}
              데이터를 불러오는 중입니다...{" "}
            </div>
          )}{" "}
          {error && !loading && (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
              {" "}
              {error}{" "}
            </div>
          )}{" "}
          {!error && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {" "}
              {summaryMetrics.map((metric) => (
                <SummaryMetric key={metric.label} metric={metric} />
              ))}{" "}
            </div>
          )}{" "}
          <div className="mt-6 flex flex-wrap gap-2">
            {" "}
            {filters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${filter.active ? "border-emerald-500 bg-emerald-500 text-white shadow-sm" : "border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"}`}
              >
                {" "}
                {filter.label}{" "}
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] ${filter.active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"}`}
                >
                  {" "}
                  {filter.badge}{" "}
                </span>{" "}
              </button>
            ))}{" "}
          </div>{" "}
        </section>{" "}
        <section className="space-y-6">
          {" "}
          {loading ? (
            <div className="rounded-3xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
              {" "}
              주문 정보를 불러오는 중입니다...{" "}
            </div>
          ) : orderCards.length > 0 ? (
            orderCards.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
              {" "}
              아직 주문 내역이 없습니다. 마음에 드는 상품을 담아보세요!{" "}
            </div>
          )}{" "}
        </section>{" "}
        <section className="grid gap-6 md:grid-cols-2">
          {" "}
          <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            {" "}
            <header className="flex items-center gap-3">
              {" "}
              <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                {" "}
                <Heart className="size-5" />{" "}
              </span>{" "}
              <div>
                {" "}
                <h2 className="text-lg font-semibold text-neutral-900">
                  {" "}
                  찜한 상품{" "}
                  <span className="ml-2 text-sm text-emerald-500">
                    {" "}
                    {wishlistProducts.length}{" "}
                  </span>{" "}
                </h2>{" "}
                <p className="text-xs text-neutral-400">
                  {" "}
                  관심 상품을 한 번에 확인하고 다시 담아보세요.{" "}
                </p>{" "}
              </div>{" "}
            </header>{" "}
            {wishlistProducts.length > 0 ? (
              <div className="space-y-3">
                {" "}
                {wishlistProducts.map((product) => (
                  <ProductPreviewCard
                    key={product.product_id}
                    product={product}
                  />
                ))}{" "}
              </div>
            ) : (
              <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
                {" "}
                아직 찜한 상품이 없습니다.{" "}
              </div>
            )}{" "}
          </div>{" "}
          <div className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            {" "}
            <header className="flex items-center gap-3">
              {" "}
              <span className="flex size-10 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                {" "}
                <Clock className="size-5" />{" "}
              </span>{" "}
              <div>
                {" "}
                <h2 className="text-lg font-semibold text-neutral-900">
                  {" "}
                  최근 본 상품{" "}
                  <span className="ml-2 text-sm text-sky-500">
                    {" "}
                    {recentProducts.length}{" "}
                  </span>{" "}
                </h2>{" "}
                <p className="text-xs text-neutral-400">
                  {" "}
                  다시 보고 싶은 상품을 놓치지 마세요.{" "}
                </p>{" "}
              </div>{" "}
            </header>{" "}
            {recentProducts.length > 0 ? (
              <div className="space-y-3">
                {" "}
                {recentProducts.map((product) => (
                  <ProductPreviewCard
                    key={product.product_id}
                    product={product}
                  />
                ))}{" "}
              </div>
            ) : (
              <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 text-sm text-neutral-500">
                {" "}
                최근 본 상품이 없습니다.{" "}
              </div>
            )}{" "}
          </div>{" "}
        </section>{" "}
      </main>{" "}
    </div>
  );
}
