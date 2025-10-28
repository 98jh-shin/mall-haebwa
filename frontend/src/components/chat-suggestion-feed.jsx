import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ShoppingCart, ExternalLink } from "lucide-react";

const ingredients = [
  "국산 배추 1포기",
  "김장용 절임배추 5kg",
  "한돈 삼겹살 300g",
  "돼지 앞다리 250g",
  "한우 사골 육수팩",
  "멸치 다시팩 10입",
  "재래식 청국장",
  "전통 고추장 500g",
  "고춧가루 태양초 200g",
  "신선한 두부 1모",
  "대파 다짐팩",
  "다진마늘 200g",
];

const descFragments = [
  "국내산 재료로 만들어 더욱 믿을 수 있어요.",
  "김치찌개 국물 맛을 살려주는 핵심 재료입니다.",
  "손질되어 바로 사용하기 편리합니다.",
  "냉장 보관으로 신선도를 유지했어요.",
  "푸짐한 양과 더 깊은 감칠맛을 제공합니다.",
  "깔끔한 포장으로 위생적으로 배송돼요.",
  "요리 초보도 쉽게 사용할 수 있는 제품입니다.",
  "다양한 찌개나 국물 요리에 활용해보세요.",
];

const imagePool = {
  "국산 배추 1포기":
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTk2vEIXsJahuko9_RAsa6y_Vss54tKrGW2AT-yjCH4kc7So6dKEnV0BPUUUvSEUx438eLyxeWl_cGDfkxiCplx9VL0oosp7IdNz84Q7Fo&usqp=CAc",
  "김장용 절임배추 5kg":
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTk2vEIXsJahuko9_RAsa6y_Vss54tKrGW2AT-yjCH4kc7So6dKEnV0BPUUUvSEUx438eLyxeWl_cGDfkxiCplx9VL0oosp7IdNz84Q7Fo&usqp=CAc",
  "한돈 삼겹살 300g":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRbu7vVyUsTbaFnUhFJdAC2DYBfxesUkSFwaO0F-4-JNWddPddpddb0rbHWy8ReOMbW4jBx2dN7ElDziUw5xe8G9iDFjAw3bgfCSB6T9kpK2ecmjgCA8hpO&usqp=CAc",
  "돼지 앞다리 250g":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRbu7vVyUsTbaFnUhFJdAC2DYBfxesUkSFwaO0F-4-JNWddPddpddb0rbHWy8ReOMbW4jBx2dN7ElDziUw5xe8G9iDFjAw3bgfCSB6T9kpK2ecmjgCA8hpO&usqp=CAc",
  "한우 사골 육수팩":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQl0Fb2hNpBfQqbxXDdnsue1NmUoDSTDOlwPCnCgAjm8ju8WI1KUgOJLUdZ04JIeqWDX6By0a5RLZwRuVYJAj8Q6ZAsI-vvas9LPmYKbiD2ZHevuwqkeADBThNdP8pC2cKrxutcSg&usqp=CAc",
  "멸치 다시팩 10입":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQl0Fb2hNpBfQqbxXDdnsue1NmUoDSTDOlwPCnCgAjm8ju8WI1KUgOJLUdZ04JIeqWDX6By0a5RLZwRuVYJAj8Q6ZAsI-vvas9LPmYKbiD2ZHevuwqkeADBThNdP8pC2cKrxutcSg&usqp=CAc",
  "재래식 청국장":
    "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRMHPpoX-KqEwqRnzM6Jyb3GQzFL3rugtcm4POmj5z_sOADr2KYcaE3cB3F2skpa1Mjc4sTJGHhSmDIVTJDVr7rff8OebGaa_np-14C9LOSr-IecoMK3CLDFrC9UemcuGNMnUzVDw&usqp=CAc",
  "전통 고추장 500g":
    "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRKyS7s0MhQPULYeKrx2Gi7VVA1Lp8jz7ZrHgiYOBVEEpgR9mQCaEGI0ZvU4cQtqpz6FIu_Alhc7RHRSo-py7Xd7zQmvn-aSEXM1FkdAADaGyct6CXvxP3tNPlzObhuWDbLaIpxXZ8&usqp=CAc",
  "고춧가루 태양초 200g":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH1YiediGH_SxklAdZo8Mp_mxHVt098PcbqA&s",
  "신선한 두부 1모":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkJgX4n_2YY3WczYizX19cuQ0xxL32SCPpig&s",
  "대파 다짐팩":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFIdz2JHJef0PxvVdJ06YWKKd95jBEGnYdmg&s",
  "다진마늘 200g":
    "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSAGYyFIbdQdw73FtqnOX5P3RoorGCkcCHVgDzv_3Z8n26BcCoVdj2kY7bC7yaPD8VenHpbwnD5WCZTuesPw1C7qDHI0zHwhM22BcT_dQS1wMU7H_Vkp5Chb7bw0M0SlcKsbJvoKV0&usqp=CAc",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1583224964978-2257b960c3d3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2ltY2hpfGVufDB8fDB8fHww&auto=format&fit=crop&w=640&q=80";

const storeNames = ["SwiftCart 마켓", "SwiftCart 프레시", "SwiftCart 장보기"];

const shippingOptions = ["무료배송", "오늘출발", "새벽배송", "3,000원"];

const formatter = new Intl.NumberFormat("ko-KR");

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSuggestion(id) {
  const name = pickRandom(ingredients); // 랜덤 재료 하나 뽑기
  const basePrice = Math.floor(Math.random() * 15000) + 3000;
  const sale = Math.random() > 0.6 ? Math.floor(Math.random() * 15) + 5 : 0;
  const salePrice =
    sale > 0
      ? Math.round((basePrice * (1 - sale / 100)) / 100) * 100
      : basePrice;

  return {
    id,
    name: name,
    description: `${pickRandom(descFragments)} ${pickRandom(descFragments)}`,
    image: imagePool[name], // ✅ 이름으로 접근 + fallback
    store: pickRandom(storeNames),
    price: formatter.format(basePrice),
    salePrice: formatter.format(salePrice),
    salePercent: sale,
    shipping: pickRandom(shippingOptions),
  };
}

export default function ChatSuggestionFeed({ topic }) {
  const [items, setItems] = useState(() =>
    Array.from({ length: 8 }, (_, index) => generateSuggestion(index))
  );
  const [page, setPage] = useState(1);

  const { ref, inView } = useInView({
    rootMargin: "400px 0px",
  });

  const loadMore = useCallback(() => {
    setItems((prev) => {
      const offset = prev.length;
      const next = Array.from({ length: 8 }, (_, index) =>
        generateSuggestion(offset + index)
      );
      return [...prev, ...next];
    });
    setPage((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  return (
    <section className="mt-8 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            더 찾아본 {topic} 관련 재료
          </h2>
          <p className="text-xs text-neutral-500">
            아래 목록은 스크롤할수록 자동으로 이어집니다. ({page} 페이지)
          </p>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-40 w-full overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-contain transition duration-500 hover:scale-105"
                onError={(event) => {
                  event.currentTarget.src = fallbackImage;
                  event.currentTarget.onerror = null;
                }}
              />
              {item.salePercent > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-rose-500 px-2 py-1 text-xs font-semibold text-white">
                  {item.salePercent}% OFF
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-2 px-4 py-3 text-sm text-neutral-600">
              <span className="text-xs font-semibold text-emerald-600">
                {item.store}
              </span>
              <h3 className="text-base font-semibold text-neutral-900">
                {item.name}
              </h3>
              <p className="line-clamp-3 text-xs text-neutral-500">
                {item.description}
              </p>
              <div className="mt-auto flex items-baseline gap-2">
                <span className="text-lg font-bold text-neutral-900">
                  {item.salePrice}원
                </span>
                {item.salePercent > 0 && (
                  <span className="text-xs text-neutral-400 line-through">
                    {item.price}원
                  </span>
                )}
              </div>
              <span className="text-xs text-neutral-500">
                배송 {item.shipping}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3 text-xs">
              <button className="inline-flex items-center gap-1 rounded-full border border-emerald-500 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-600 transition hover:bg-emerald-100">
                <ShoppingCart className="size-3.5" />
                담기
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-neutral-400 hover:text-neutral-600">
                상세보기 <ExternalLink className="size-3.5" />
              </a>
            </div>
          </article>
        ))}
      </div>

      <div ref={ref} className="mt-6 flex justify-center">
        <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-xs text-neutral-500">
          더 불러오는 중...
        </div>
      </div>
    </section>
  );
}
