import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, PackagePlus, CheckCircle2, AlertCircle } from "lucide-react";
import TopBar from "../components/topbar";
import {
  AUTH_EVENT,
  getAccessToken,
  getUserRole,
} from "../utils/auth";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const CATEGORY_OPTIONS = [
  { label: "생활/리빙", value: "living" },
  { label: "패션/잡화", value: "fashion" },
  { label: "디지털/가전", value: "electronics" },
  { label: "식품", value: "food" },
  { label: "뷰티/헬스", value: "beauty" },
  { label: "스포츠/레저", value: "sports" },
];
const STATUS_OPTIONS = [
  { label: "즉시 공개", value: "published" },
  { label: "임시 저장", value: "draft" },
  { label: "품절 처리", value: "out_of_stock" },
];
const SHIPPING_OPTIONS = [
  { label: "무료 배송", value: "free" },
  { label: "유료 배송 (3,000원)", value: "flat_3000" },
  { label: "오늘 출발", value: "same_day" },
];
const initialFormState = {
  title: "",
  subtitle: "",
  sku: "",
  barcode: "",
  price: "",
  sale_price: "",
  stock: "",
  category: CATEGORY_OPTIONS[0].value,
  shipping: SHIPPING_OPTIONS[0].value,
  status: STATUS_OPTIONS[0].value,
  thumbnail_url: "",
  gallery: "",
  description: "",
  keywords: "",
  tags: "",
  is_recommended: true,
  recommendation_reason: "",
};
function SectionHeader({ icon, title, description }) {
  const IconComponent = icon;
  return (
    <header className="mb-6 flex flex-col gap-2">
      {" "}
      <div className="flex items-center gap-2 text-emerald-600">
        {" "}
        <span className="grid size-9 place-items-center rounded-full bg-emerald-100">
          {" "}
          <IconComponent className="size-4" />{" "}
        </span>{" "}
        <span className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
          {" "}
          SwiftCart 관리자{" "}
        </span>{" "}
      </div>{" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>{" "}
        <p className="mt-2 text-sm text-neutral-500">{description}</p>{" "}
      </div>{" "}
    </header>
  );
}
function FormLabel({ label, required = false, hint }) {
  return (
    <div className="flex items-baseline justify-between">
      {" "}
      <span className="text-sm font-semibold text-neutral-700">
        {" "}
        {label}{" "}
        {required ? (
          <span className="ml-1 text-xs font-medium text-rose-500">*</span>
        ) : null}{" "}
      </span>{" "}
      {hint ? (
        <span className="text-xs text-neutral-400">{hint}</span>
      ) : null}{" "}
    </div>
  );
}
export default function AdminProductCreatePage() {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => getAccessToken());
  const [role, setRole] = useState(() => getUserRole());
  const [form, setForm] = useState(() => ({ ...initialFormState }));
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const effectivePrice = useMemo(() => {
    const price = Number(form.price) || 0;
    const sale = Number(form.sale_price) || null;
    if (!sale) return price;
    return sale > 0 && sale < price ? sale : price;
  }, [form.price, form.sale_price]);
  const discountRate = useMemo(() => {
    const price = Number(form.price) || 0;
    const sale = Number(form.sale_price) || 0;
    if (!price || !sale || sale >= price) return 0;
    return Math.round(((price - sale) / price) * 100);
  }, [form.price, form.sale_price]);
  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const toggleRecommended = () => {
    setForm((prev) => ({ ...prev, is_recommended: !prev.is_recommended }));
  };
  const resetForm = () => {
    setForm({ ...initialFormState });
  };

  useEffect(() => {
    const syncAuth = () => {
      setToken(getAccessToken());
      setRole(getUserRole());
    };
    window.addEventListener(AUTH_EVENT, syncAuth);
    return () => window.removeEventListener(AUTH_EVENT, syncAuth);
  }, []);

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [token, role, navigate]);

  const validate = () => {
    if (!form.title.trim()) {
      return "상품 이름을 입력해주세요.";
    }
    const priceValue = Number(form.price);
    if (!Number.isFinite(priceValue) || priceValue <= 0) {
      return "정상 판매가를 입력해주세요.";
    }
    if (form.sale_price) {
      const saleValue = Number(form.sale_price);
      if (!Number.isFinite(saleValue) || saleValue <= 0) {
        return "올바른 할인 가격을 입력해주세요.";
      }
      if (saleValue >= priceValue) {
        return "할인 가격은 정상가보다 낮아야 합니다.";
      }
    }
    const stockValue = Number(form.stock);
    if (form.stock === "" || !Number.isFinite(stockValue) || stockValue < 0) {
      return "재고 수량을 입력해주세요.";
    }
    return null;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const errorMessage = validate();
    if (errorMessage) {
      setFeedback({ type: "error", message: errorMessage });
      return;
    }
    setSubmitting(true);
    setFeedback(null);

    if (!token || role !== "admin") {
      setFeedback({
        type: "error",
        message: "관리자 인증이 필요합니다. 다시 로그인해주세요.",
      });
      setSubmitting(false);
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      sale_price: form.sale_price ? Number(form.sale_price) : null,
      stock: Number(form.stock),
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      keywords: form.keywords
        .split(",")
        .map((word) => word.trim())
        .filter(Boolean),
      gallery: form.gallery
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      is_recommended: form.is_recommended,
      recommendation_reason: form.recommendation_reason.trim(),
    };
    try {
      const response = await fetch(`${API_BASE_URL}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "상품 등록에 실패했습니다.");
      }
      const data = await response
        .json()
        .catch(() => ({ message: "상품이 등록되었습니다." }));
      setFeedback({
        type: "success",
        message: data.message || "상품이 등록되었습니다.",
      });
      resetForm();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.message || "상품 등록 중 오류가 발생했습니다.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!token || role !== "admin") {
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 via-white to-emerald-50">
      {" "}
      <TopBar
        onSearch={(keyword) => {
          navigate(`/search?keyword=${encodeURIComponent(keyword)}`);
        }}
      />{" "}
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 lg:px-6">
        {" "}
        <SectionHeader
          icon={PackagePlus}
          title="신규 상품 등록"
          description="새로운 상품을 SwiftCart 스토어에 등록하고 판매를 시작하세요."
        />{" "}
        {feedback ? (
          <div
            className={`mb-8 flex items-center gap-3 rounded-3xl border px-4 py-3 text-sm ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-600"}`}
          >
            {" "}
            {feedback.type === "success" ? (
              <CheckCircle2 className="size-5 shrink-0" />
            ) : (
              <AlertCircle className="size-5 shrink-0" />
            )}{" "}
            <span>{feedback.message}</span>{" "}
            {feedback.type === "success" ? (
              <button
                type="button"
                className="ml-auto text-xs font-semibold text-emerald-700 underline underline-offset-2"
                onClick={() => navigate("/")}
              >
                {" "}
                홈으로 돌아가기{" "}
              </button>
            ) : null}{" "}
          </div>
        ) : null}{" "}
        <form
          onSubmit={handleSubmit}
          className="grid gap-6 lg:grid-cols-[2fr,1fr]"
        >
          {" "}
          <section className="space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            {" "}
            <div className="grid gap-6">
              {" "}
              <div className="grid gap-2">
                {" "}
                <FormLabel
                  label="상품 이름"
                  required
                  hint="쇼핑 검색에 노출됩니다."
                />{" "}
                <input
                  type="text"
                  value={form.title}
                  onChange={updateField("title")}
                  placeholder="예) 네오보이스 노이즈캔슬링 이어버드"
                  className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                />{" "}
              </div>{" "}
              <div className="grid gap-2">
                {" "}
                <FormLabel
                  label="상품 한줄 소개"
                  hint="썸네일과 상세 페이지 상단에 사용됩니다."
                />{" "}
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={updateField("subtitle")}
                  placeholder="예) 몰입감 극대화, 42시간 올데이 배터리"
                  className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                />{" "}
              </div>{" "}
              <div className="grid gap-4 md:grid-cols-3">
                {" "}
                {/* <div className="grid gap-2">                  <FormLabel label="SKU" required hint="내부 관리용 고유 코드" />                  <input                    type="text"                    value={form.sku}                    onChange={updateField("sku")}                    placeholder="예) NXE-B43-PRO"                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"                  />                </div> */}{" "}
                {/* <div className="grid gap-2">                  <FormLabel label="바코드" hint="선택 사항" />                  <input                    type="text"                    value={form.barcode}                    onChange={updateField("barcode")}                    placeholder="EAN, UPC 등 바코드"                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"                  />                </div> */}{" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel label="재고 수량" required />{" "}
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={updateField("stock")}
                    placeholder="예) 320"
                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid gap-4 md:grid-cols-2">
                {" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel label="정상 판매가" required />{" "}
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={updateField("price")}
                    placeholder="예) 239000"
                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  />{" "}
                </div>{" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel
                    label="할인 판매가"
                    hint="미입력 시 정상가로 노출됩니다."
                  />{" "}
                  <input
                    type="number"
                    min="0"
                    value={form.sale_price}
                    onChange={updateField("sale_price")}
                    placeholder="예) 179000"
                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid gap-4 md:grid-cols-2">
                {" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel label="대표 이미지 URL" required />{" "}
                  <input
                    type="url"
                    value={form.thumbnail_url}
                    onChange={updateField("thumbnail_url")}
                    placeholder="https://..."
                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  />{" "}
                </div>{" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel
                    label="갤러리 이미지"
                    hint="줄바꿈으로 여러 개 입력"
                  />{" "}
                  <textarea
                    value={form.gallery}
                    onChange={updateField("gallery")}
                    placeholder="이미지 URL을 줄바꿈으로 구분해 입력하세요."
                    className="min-h-[120px] rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div className="grid gap-2">
                {" "}
                <FormLabel label="상품 상세 설명" required />{" "}
                <textarea
                  value={form.description}
                  onChange={updateField("description")}
                  placeholder="상품의 특징, 구성품, 주의사항 등을 상세하게 작성해주세요."
                  className="min-h-[160px] rounded-3xl border border-neutral-200 px-5 py-4 text-sm leading-relaxed text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                />{" "}
              </div>{" "}
              <div className="grid gap-4 md:grid-cols-2">
                {" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel
                    label="검색 키워드"
                    hint="콤마로 구분하여 입력"
                  />{" "}
                  <input
                    type="text"
                    value={form.keywords}
                    onChange={updateField("keywords")}
                    placeholder="예) 노이즈캔슬링, 블루투스 이어폰"
                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  />{" "}
                </div>{" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel label="태그" hint="콤마로 구분하여 입력" />{" "}
                  <input
                    type="text"
                    value={form.tags}
                    onChange={updateField("tags")}
                    placeholder="예) 프리미엄, 베스트셀러"
                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-800 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  />{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </section>{" "}
          <aside className="space-y-6">
            {" "}
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              {" "}
              <div className="flex items-center gap-3">
                {" "}
                <span className="grid size-10 place-items-center rounded-full bg-purple-50 text-purple-500">
                  {" "}
                  <Sparkles className="size-5" />{" "}
                </span>{" "}
                <div>
                  {" "}
                  <h2 className="text-lg font-semibold text-neutral-900">
                    {" "}
                    노출 설정{" "}
                  </h2>{" "}
                  <p className="text-xs text-neutral-400">
                    {" "}
                    채널과 판매 상태를 제어하세요.{" "}
                  </p>{" "}
                </div>{" "}
              </div>{" "}
              <div className="mt-5 space-y-4">
                {" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel label="카테고리" />{" "}
                  <select
                    value={form.category}
                    onChange={updateField("category")}
                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-700 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  >
                    {" "}
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {" "}
                        {option.label}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel label="유통/배송 옵션" />{" "}
                  <select
                    value={form.shipping}
                    onChange={updateField("shipping")}
                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-700 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  >
                    {" "}
                    {SHIPPING_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {" "}
                        {option.label}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div className="grid gap-2">
                  {" "}
                  <FormLabel label="판매 상태" />{" "}
                  <select
                    value={form.status}
                    onChange={updateField("status")}
                    className="h-12 rounded-2xl border border-neutral-200 px-4 text-sm text-neutral-700 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                  >
                    {" "}
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {" "}
                        {option.label}{" "}
                      </option>
                    ))}{" "}
                  </select>{" "}
                </div>{" "}
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-200/60 bg-emerald-50/40 px-4 py-3">
                  {" "}
                  <div>
                    {" "}
                    <p className="text-sm font-semibold text-neutral-800">
                      {" "}
                      인기 추천 상품으로 노출{" "}
                    </p>{" "}
                    <p className="text-xs text-neutral-500">
                      {" "}
                      홈 화면의 인기 추천 영역에 이 상품이 나타납니다.{" "}
                    </p>{" "}
                  </div>{" "}
                  <button
                    type="button"
                    onClick={toggleRecommended}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full border transition ${form.is_recommended ? "justify-end border-emerald-500 bg-emerald-500/90" : "justify-start border-neutral-300 bg-white"}`}
                    aria-pressed={form.is_recommended}
                  >
                    {" "}
                    <span
                      className={`mx-1 grid size-6 place-items-center rounded-full text-[11px] font-semibold ${form.is_recommended ? "bg-white text-emerald-600" : "bg-neutral-200 text-neutral-600"}`}
                    >
                      {" "}
                      {form.is_recommended ? "ON" : "OFF"}{" "}
                    </span>{" "}
                  </button>{" "}
                </div>{" "}
                {form.is_recommended ? (
                  <div className="grid gap-2">
                    {" "}
                    <FormLabel
                      label="추천 문구"
                      hint="인기 추천 섹션에 함께 노출됩니다."
                    />{" "}
                    <textarea
                      value={form.recommendation_reason}
                      onChange={updateField("recommendation_reason")}
                      placeholder="예) 프리미엄 사운드를 즐기고 싶은 고객님께 추천드려요."
                      className="min-h-[90px] rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/50"
                    />{" "}
                  </div>
                ) : null}{" "}
              </div>{" "}
            </section>{" "}
            <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              {" "}
              <h2 className="text-lg font-semibold text-neutral-900">
                {" "}
                요약 미리보기{" "}
              </h2>{" "}
              <p className="mt-1 text-xs text-neutral-400">
                {" "}
                입력 중인 정보로 상품 카드가 어떻게 보일지 확인하세요.{" "}
              </p>{" "}
              <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-100 bg-neutral-50 shadow-inner">
                {" "}
                <div className="relative h-40 bg-neutral-200/60">
                  {" "}
                  {form.thumbnail_url ? (
                    <img
                      src={form.thumbnail_url}
                      alt="상품 미리보기"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-sm text-neutral-500">
                      {" "}
                      대표 이미지 미입력{" "}
                    </div>
                  )}{" "}
                </div>{" "}
                <div className="space-y-2 px-4 py-5">
                  {" "}
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                    {" "}
                    {CATEGORY_OPTIONS.find((opt) => opt.value === form.category)
                      ?.label || "카테고리"}{" "}
                  </span>{" "}
                  <h3 className="text-base font-semibold text-neutral-900">
                    {" "}
                    {form.title || "상품 이름"}{" "}
                  </h3>{" "}
                  <p className="line-clamp-2 text-xs text-neutral-500">
                    {" "}
                    {form.subtitle || "한줄 소개가 여기에 표시됩니다."}{" "}
                  </p>{" "}
                  <div className="flex items-baseline gap-2">
                    {" "}
                    {discountRate > 0 ? (
                      <span className="text-sm font-semibold text-rose-500">
                        {" "}
                        {discountRate}%{" "}
                      </span>
                    ) : null}{" "}
                    <span className="text-xl font-bold text-neutral-900">
                      {" "}
                      {effectivePrice
                        ? new Intl.NumberFormat("ko-KR").format(effectivePrice)
                        : "가격 미정"}{" "}
                      원{" "}
                    </span>{" "}
                  </div>{" "}
                  {form.sale_price && Number(form.sale_price) > 0 ? (
                    <span className="text-xs text-neutral-400 line-through">
                      {" "}
                      {new Intl.NumberFormat("ko-KR").format(
                        Number(form.price) || 0,
                      )}{" "}
                      원{" "}
                    </span>
                  ) : null}{" "}
                </div>{" "}
              </div>{" "}
            </section>{" "}
            <div className="flex flex-col gap-3 rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-5 text-sm text-neutral-600">
              {" "}
              <p>
                {" "}
                모든 정보가 정확한지 확인하셨다면 아래 버튼을 눌러 상품을
                등록해주세요. 임시 저장 상태에서는 스토어에 노출되지
                않습니다.{" "}
              </p>{" "}
              <div className="flex flex-wrap gap-3">
                {" "}
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={submitting}
                  className="rounded-full border border-neutral-300 px-4 py-2 text-xs font-semibold text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {" "}
                  내용 초기화{" "}
                </button>{" "}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {" "}
                  <PackagePlus className="size-4" />{" "}
                  {submitting ? "등록 중..." : "상품 등록하기"}{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </aside>{" "}
        </form>{" "}
      </main>{" "}
    </div>
  );
}
