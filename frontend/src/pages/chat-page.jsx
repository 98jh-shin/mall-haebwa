import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Bot,
  MessageCircle,
  Sparkles,
  UtensilsCrossed,
  ExternalLink,
} from "lucide-react";
import TopBar from "../components/topbar";
import ChatSuggestionFeed from "../components/chat-suggestion-feed";

const DEFAULT_QUERY = "김치찌개 재료를 찾아줘!!";

const isKimchiSearchQuery = (value) => {
  const compact = value.replace(/\s+/g, "");
  const trimmed = compact.replace(/!+$/, "");
  return trimmed === "김치찌개";
};

const RECOMMENDED_ITEMS = [
  {
    title: "한우 사골육수 1L",
    description: "깊고 진한 국물 맛을 위해 끓여낸 한우 사골 육수.",
    image:
      "https://images.unsplash.com/photo-1644131447600-dcf173a37728?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTZ8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
    link: "#",
    tags: ["국물 베이스", "한우"],
  },
  {
    title: "국산 돼지 앞다리 300g",
    description: "국내 농장에서 도축한 신선한 돼지고기 앞다리살.",
    image:
      "https://images.unsplash.com/photo-1703046598921-01b2b97bcafa?ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fGtpbWNoaXxlbnwwfHx8fDE3NjE1Mzk4MzJ8MA&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
    link: "#",
    tags: ["고기", "신선식품"],
  },
  {
    title: "재래식 된장 500g",
    description: "구수한 향이 살아있는 전통 재래식 된장.",
    image:
      "https://images.unsplash.com/photo-1583224944844-5b268c057b72?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8a2ltY2hpfGVufDB8fHx8MTc2MTUzOTgzMnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
    link: "#",
    tags: ["장류", "발효"],
  },
  {
    title: "흔한 마트 채소 모음",
    description: "대파, 양파, 청양고추까지 깔끔하게 손질된 채소 세트.",
    image:
      "https://images.unsplash.com/photo-1616787928056-ae5ab4b649d8?ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8a2ltY2hpfGVufDB8fHx8MTc2MTUzOTgzMnww&ixlib=rb-4.1.0&auto=format&fit=crop&w=640&q=80",
    link: "#",
    tags: ["채소", "손질"],
  },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2ltY2hpfGVufDB8fDB8fHww&auto=format&fit=crop&w=640&q=80";

export default function ChatPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const query = searchParams.get("query") || DEFAULT_QUERY;
  const category = searchParams.get("category") || "전체";

  const handleSearch = (nextQuery, nextCategory) => {
    const normalized = nextQuery.trim();
    const compact = normalized.replace(/\s+/g, "");
    const params = new URLSearchParams({
      query: normalized,
      category: nextCategory,
    });

    if (isKimchiSearchQuery(compact)) {
      navigate(`/search?${params.toString()}`);
    } else {
      navigate(`/chat?${params.toString()}`);
    }
  };

  const assistantMessage = useMemo(
    () => ({
      intro: `"${query}" 검색 결과 김치찌개를 만들기 위해 필요한 기본 재료를 정리해 봤어요.`,
      essentials: [
        "돼지고기 앞다리살 200~300g",
        "신 김치 2컵 (국물 포함)",
        "대파 1대, 양파 1/2개",
        "두부 1/2모, 청양고추 1~2개",
        "고춧가루 2큰술, 고추장 1큰술, 다진 마늘 1큰술",
        "멸치 or 사골 육수 3컵",
      ],
      tips: [
        "김치에 설탕 1/2큰술을 더하면 더욱 감칠맛이 살아나요.",
        "돼지고기는 기름을 살짝 제거하고 볶아주면 잡내가 줄어듭니다.",
        "육수를 끓인 뒤 된장 1작은술을 더하면 국물 맛이 한층 깊어져요.",
      ],
    }),
    [query]
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopBar onSearch={handleSearch} />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-8 lg:px-0">
        <header className="flex flex-col gap-2 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-600">
            <MessageCircle className="size-4" />
            대화형 검색
          </div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            "{query}"에 대한 맞춤 추천
          </h1>
          <p className="text-sm text-neutral-500">
            현재 선택된 카테고리: <span className="font-medium">{category}</span>
          </p>
        </header>

        <section className="space-y-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-neutral-900 text-white">
                  너
                </div>
                <div>
                  <p className="rounded-2xl bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-800">
                    {query}
                  </p>
                  <span className="mt-1 block text-xs text-neutral-400">
                    방금 전
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-emerald-500 text-white">
                  <Bot className="size-5" />
                </div>
                <div className="flex-1 space-y-4 rounded-3xl bg-emerald-50 px-4 py-4 text-sm text-neutral-700">
                  <p className="font-semibold text-neutral-900">
                    {assistantMessage.intro}
                  </p>
                  <div>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                      <UtensilsCrossed className="size-4 text-emerald-500" />
                      필수 재료 목록
                    </h3>
                    <ul className="grid gap-1 text-sm leading-relaxed">
                      {assistantMessage.essentials.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                      <Sparkles className="size-4 text-emerald-500" />
                      맛있게 끓이는 팁
                    </h3>
                    <ul className="grid gap-1 text-sm leading-relaxed">
                      {assistantMessage.tips.map((tip) => (
                        <li key={tip} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-emerald-300" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <header className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  추천 쇼핑 목록
                </h2>
                <p className="text-xs text-neutral-500">
                  김치찌개를 완성할 수 있는 필수 재료 4가지를 골라봤어요.
                </p>
              </div>
            </header>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {RECOMMENDED_ITEMS.map((item) => (
                <article
                  key={item.title}
                  className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 text-sm text-neutral-600 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                        event.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      {item.title}
                    </h3>
                    <p className="line-clamp-3 text-xs text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between px-4 pb-3">
                    <button className="text-xs font-semibold text-emerald-600 hover:underline">
                      장바구니 담기
                    </button>
                    <a
                      href={item.link}
                      className="inline-flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-600"
                    >
                      상세보기 <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <ChatSuggestionFeed topic={query} />
      </main>
    </div>
  );
}
