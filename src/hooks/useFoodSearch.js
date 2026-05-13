import { useState, useEffect, useCallback } from "react";
import { foodApi } from "../services/api";
import { useDebounce } from "./useDebounce";

export function useFoodSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const debouncedQuery = useDebounce(query, 600);

  const fetchProducts = useCallback(async (searchQuery, pageNum = 1) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await foodApi.searchProducts(searchQuery, pageNum);
      setResults((prev) =>
        pageNum === 1 ? data.products : [...prev, ...data.products]
      );
      setTotal(data.total);
    } catch (err) {
      setError(err.message || "Ошибка при поиске продуктов");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Срабатывает при изменении дебаунс-запроса
  useEffect(() => {
    setPage(1);
    fetchProducts(debouncedQuery, 1);
  }, [debouncedQuery, fetchProducts]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(debouncedQuery, nextPage);
  };

  const reset = () => {
    setQuery("");
    setResults([]);
    setError(null);
    setPage(1);
    setTotal(0);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    total,
    loadMore,
    reset,
    hasMore: results.length < total,
  };
}