import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    tag: "이번 주 추천",
    title: "웰다 특급 적립",
    description: "득템 특가 모음을 한 번에 만나보세요.",
    gradient: "from-[#5D2CFF] via-[#7C3AFF] to-[#9340FF]",
  },
  {
    tag: "사전 세일",
    title: "넵다세일",
    description: "미리 보는 본행사 혜택 라인업.",
    gradient: "from-[#5036FF] via-[#5E46FF] to-[#FF4AA9]",
  },
  {
    tag: "연동 이벤트",
    title: "아이디어 톡톡",
    description: "귀여운 뽀짝 혜택이 선물은 덤!",
    gradient: "from-[#1649FF] via-[#315CFF] to-[#00D5D9]",
  },
  {
    tag: "럭셔리 큐레이션",
    title: "HIGHEND PICK",
    description: "네이버가 선보이는 하이엔드 신규 셀렉션.",
    gradient: "from-[#121212] via-[#2E1F3C] to-[#5C2D91]",
  },
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1280 },
    items: 3,
    partialVisibilityGutter: 24,
  },
  laptop: {
    breakpoint: { max: 1280, min: 1024 },
    items: 3,
    partialVisibilityGutter: 16,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    partialVisibilityGutter: 16,
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1,
    partialVisibilityGutter: 24,
  },
};

function ArrowButton({ onClick, direction }) {
  const labels = {
    left: "이전 슬라이드",
    right: "다음 슬라이드",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={labels[direction]}
      className="group grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-md transition hover:border-purple-400 hover:text-purple-600"
    >
      {direction === "left" ? (
        <ChevronLeft className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </button>
  );
}

function PromoCard({ slide }) {
  return (
    <article
      className={`relative flex h-52 flex-col overflow-hidden rounded-3xl bg-gradient-to-r ${slide.gradient} p-6 text-white shadow-lg`}
    >
      <div className="pointer-events-none absolute -right-10 top-6 h-28 w-28 rounded-full bg-white/20 blur-xl" />
      <div className="pointer-events-none absolute -bottom-16 right-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
        {slide.tag}
      </span>
      <h3 className="mt-5 text-2xl font-extrabold tracking-tight">
        {slide.title}
      </h3>
      <p className="mt-2 text-sm text-white/85">{slide.description}</p>
      <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-white/90">
        지금 바로 보기
        <ChevronRight className="size-4" />
      </div>
    </article>
  );
}

export default function PromoCarousel() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 lg:px-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            지금 주목할 기획전
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            인기 있는 혜택을 모아 빠르게 둘러보세요.
          </p>
        </div>
      </header>
      <div className="relative">
        <Carousel
          responsive={responsive}
          showDots
          infinite
          partialVisible
          autoPlay
          autoPlaySpeed={4000}
          pauseOnHover
          keyBoardControl
          customTransition="transform 600ms ease"
          containerClass="pb-10"
          itemClass="px-2"
          dotListClass="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-2"
          customLeftArrow={<ArrowButton direction="left" />}
          customRightArrow={<ArrowButton direction="right" />}
        >
          {slides.map((slide) => (
            <PromoCard key={slide.title} slide={slide} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}
