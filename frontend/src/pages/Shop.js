import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";
import "./Shop.css";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export default function Shop() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        ...(category && { category }),
        ...(search && { search }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        sort, page, limit: 12,
      });
      const res = await api.get(`/api/products?${params}`);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, minPrice, maxPrice, page]);

  useEffect(() => {
    setPage(1);
  }, [category, search, sort, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.search.value);
  };

  return (
    <div className="shop-page">
      <div className="container">
        <div className="page-header">
          <h1>{category ? category.charAt(0).toUpperCase() + category.slice(1) : "All Products"}</h1>
          <p>{total} products</p>
        </div>

        <div className="shop-layout">
          {/* Sidebar Filters */}
          <aside className="shop-sidebar">
            <div className="filter-group">
              <h4>Search</h4>
              <form onSubmit={handleSearch}>
                <input
                  name="search"
                  defaultValue={search}
                  placeholder="Search products..."
                  className="filter-input"
                />
              </form>
            </div>

            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-range">
                <input
                  type="number" placeholder="Min" value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="filter-input"
                />
                <span>—</span>
                <input
                  type="number" placeholder="Max" value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-group">
              <h4>Sort By</h4>
              {SORT_OPTIONS.map((opt) => (
                <label key={opt.value} className="filter-radio">
                  <input
                    type="radio" name="sort" value={opt.value}
                    checked={sort === opt.value}
                    onChange={() => setSort(opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>

            <button className="btn btn-outline btn-full btn-sm" onClick={() => {
              setSearch(""); setMinPrice(""); setMaxPrice(""); setSort("newest");
            }}>
              Clear Filters
            </button>
          </aside>

          {/* Products */}
          <div className="shop-products">
            {loading ? (
              <div className="loader" />
            ) : products.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((p) => <ProductCard key={p._id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div className="pagination">
                    {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p} onClick={() => setPage(p)}
                        className={`page-btn ${page === p ? "active" : ""}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
