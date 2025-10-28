import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Grid3X3,
  UserRound,
  ShoppingBag,
  ChevronRight,
  PackagePlus,
} from "lucide-react";
import {
  AUTH_EVENT,
  clearAuthSession,
  getAccessToken,
  getUserEmail,
  getUserRole,
} from "../utils/auth";

const CATEGORY_OPTIONS = [
  "전체",
  "패션·의류",
  "디지털·가전",
  "생활·주방",
  "스포츠·레저",
  "뷰티",
  "유아·출산",
  "식품",
  "취미·문구",
];

const NAV_LINKS = [
  { label: "홈", variant: "primary" },
  // { label: "웰다 D-2", badge: "D-2" },
  { label: "오늘꿀딜" },
  // { label: "컬리N마트" },
  { label: "베스트" },
  { label: "공식 인증 명품" },
  // { label: "N배송" },
  // { label: "슈퍼적립" },
  // { label: "쇼핑 라이브" },
  // { label: "지금배달" },
  { label: "선물샵" },
  { label: "패션뷰티" },
  { label: "푸드윈도" },
  { label: "럭셔리" },
  { label: "미스터" },
  { label: "기획전" },
  // { label: "쿠폰" },
];

const BASE_QUICK_LINKS = [
  // { label: "카테고리", Icon: Grid3X3, href: "#" },
  { label: "마이쇼핑", Icon: UserRound, to: "/my" },
  { label: "장바구니", Icon: ShoppingBag, to: "/cart" },
];

export default function TopBar({ onSearch = () => {} }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_OPTIONS[0]);
  const [openCategory, setOpenCategory] = useState(false);
  const dropdownRef = useRef(null);
  const [session, setSession] = useState(() => ({
    token: getAccessToken(),
    email: getUserEmail(),
    role: getUserRole(),
  }));

  useEffect(() => {
    const syncSession = () => {
      setSession({
        token: getAccessToken(),
        email: getUserEmail(),
        role: getUserRole(),
      });
    };
    window.addEventListener(AUTH_EVENT, syncSession);
    return () => window.removeEventListener(AUTH_EVENT, syncSession);
  }, []);

  const isAdmin = session.role === "admin";

  const quickLinks = useMemo(() => {
    if (isAdmin) {
      return [
        ...BASE_QUICK_LINKS,
        { label: "상품 등록", Icon: PackagePlus, to: "/admin/products/create" },
      ];
    }
    return BASE_QUICK_LINKS;
  }, [isAdmin]);

  useEffect(() => {
    if (!openCategory) return;

    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setOpenCategory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openCategory]);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed, selectedCategory);
  };

  const handleLogout = () => {
    clearAuthSession();
    setSession({
      token: null,
      email: null,
      role: null,
    });
  };

  const displayName = session.email || (isAdmin ? "관리자" : "SwiftCart 회원");

  return (
    <header className="w-full border-b border-neutral-200 bg-white text-neutral-800">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="font-semibold tracking-[0.1em] text-neutral-600 font-['Tenada']">
              Mall 해봐
            </span>
            <span className="flex items-center gap-1 rounded-full border border-neutral-200 px-2 py-0.5">
              <span className="text-xs font-semibold text-emerald-500">M</span>
            </span>
          </div>
          {session.token ? (
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span className="rounded-full bg-neutral-100 px-3 py-1 font-semibold text-neutral-600">
                {displayName}
              </span>
              {isAdmin ? (
                <Link
                  to="/admin/products/create"
                  className="rounded-full border border-emerald-200 px-3 py-1 font-semibold text-emerald-600 transition hover:border-emerald-300 hover:text-emerald-700">
                  상품 등록
                </Link>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-neutral-200 px-3 py-1 font-medium text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700">
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 transition hover:border-neutral-300 hover:text-neutral-700">
              로그인 / 회원가입
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          <a
            href="/"
            className="flex items-center gap-2 text-xl font-semibold text-emerald-600">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-emerald-500 text-white">
              M
            </span>
            <span className="text-neutral-900 font-['Tenada']">Mall해봐</span>
          </a>

          <div className="flex min-w-[260px] flex-1 justify-center md:order-none">
            <div
              ref={dropdownRef}
              className="relative flex w-full max-w-2xl flex-col">
              <div className="flex w-full items-center rounded-full border border-purple-500/80 bg-white shadow-sm transition focus-within:border-purple-500 focus-within:shadow-md focus-within:ring focus-within:ring-purple-200/60">
                <button
                  type="button"
                  onClick={() => setOpenCategory((prev) => !prev)}
                  aria-haspopup="listbox"
                  aria-expanded={openCategory}
                  className="flex items-center gap-2 rounded-full pl-5 pr-3 text-sm text-neutral-600">
                  <span className="font-medium text-neutral-700">
                    {selectedCategory}
                  </span>
                  <ChevronDown
                    className={`size-4 text-neutral-400 transition ${
                      openCategory ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <span className="h-6 w-px bg-neutral-200" />
                <input
                  type="text"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
                  placeholder="상품명 또는 브랜드 입력"
                  className="h-12 flex-1 rounded-full border-0 bg-transparent px-4 text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="mr-1 flex size-10 items-center justify-center rounded-full bg-purple-500 text-white transition hover:bg-purple-600"
                  aria-label="검색">
                  <Search className="size-5" />
                </button>
              </div>
              {openCategory && (
                <div className="absolute left-3 top-[calc(100%+0.75rem)] z-20 w-48 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xl">
                  <ul
                    role="listbox"
                    className="py-2"
                    aria-label="카테고리 선택">
                    {CATEGORY_OPTIONS.map((option) => (
                      <li key={option}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={selectedCategory === option}
                          className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition ${
                            selectedCategory === option
                              ? "bg-purple-50 font-medium text-purple-600"
                              : "text-neutral-600 hover:bg-neutral-50"
                          }`}
                          onClick={() => {
                            setSelectedCategory(option);
                            setOpenCategory(false);
                          }}>
                          <span>{option}</span>
                          {selectedCategory === option && (
                            <span className="text-[11px] text-purple-500">
                              선택
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <nav className="flex items-center justify-end gap-4 md:ml-auto">
            {quickLinks.map(({ label, Icon, to, href = "#" }) => {
              const content = (
                <>
                  <span className="grid size-9 place-items-center rounded-full border border-neutral-200 text-neutral-600 transition hover:border-purple-400">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </>
              );

              return to ? (
                <Link
                  key={label}
                  to={to}
                  className="flex flex-col items-center gap-1 text-xs text-neutral-500 transition hover:text-purple-600">
                  {content}
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="flex flex-col items-center gap-1 text-xs text-neutral-500 transition hover:text-purple-600">
                  {content}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="border-t border-neutral-200 bg-neutral-50/60">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 overflow-x-auto px-4 py-3 text-sm text-neutral-600 lg:px-6">
          {NAV_LINKS.map(({ label, badge, variant }) => (
            <a
              key={label}
              href="#"
              className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 transition ${
                variant === "primary"
                  ? "bg-purple-600 font-semibold text-white"
                  : "hover:bg-white hover:text-purple-600"
              }`}>
              <span className="whitespace-nowrap">{label}</span>
              {badge && (
                <span className="rounded-full border border-purple-300 px-2 py-0.5 text-[10px] font-semibold text-purple-600">
                  {badge}
                </span>
              )}
            </a>
          ))}

          <button
            type="button"
            className="ml-auto hidden items-center gap-1 rounded-full px-2 py-1 text-xs text-neutral-500 transition hover:text-purple-600 md:flex">
            전체보기
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
