import { useState } from "react";
import { foodApi } from "../services/api";

export function useBarcode() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchByBarcode = async (barcode) => {
    if (!barcode.trim()) return;

    setLoading(true);
    setError(null);
    setProduct(null);

    try {
      const data = await foodApi.getProductByBarcode(barcode);
      setProduct(data);
    } catch (err) {
      setError(err.message || "Продукт не найден");
    } finally {
      setLoading(false);
    }
  };

  return { product, loading, error, fetchByBarcode };
}