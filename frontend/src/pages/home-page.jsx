import { useNavigate } from "react-router-dom";
import TopBar from "../components/topbar";
import PromoCarousel from "../components/promo-carousel";
import ProductFeed from "../components/product-feed";

const isKimchiSearchQuery = (value) => {
  const compact = value.replace(/\s+/g, "");
  const trimmed = compact.replace(/!+$/, "");
  return trimmed === "김치찌개";
};

export default function HomePage() {
  const navigate = useNavigate();

  const handleSearch = (query, category) => {
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
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <TopBar onSearch={handleSearch} />
      <main className="pb-16">
        <PromoCarousel />
        <ProductFeed />
      </main>
    </div>
  );
}
