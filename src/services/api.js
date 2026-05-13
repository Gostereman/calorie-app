const BASE_URL = "https://world.openfoodfacts.org";

// Утилита для обработки ответа
const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

// Нормализация данных продукта из API
export const normalizeProduct = (product) => ({
  id: product.id || product.code || Math.random().toString(36),
  name: product.product_name || "Без названия",
  brand: product.brands || "—",
  quantity: product.quantity || "",
  image: product.image_small_url || null,
  nutrients: {
    kcal: Math.round(product.nutriments?.["energy-kcal_100g"] ?? 0),
    proteins: parseFloat(product.nutriments?.proteins_100g ?? 0).toFixed(1),
    fats: parseFloat(product.nutriments?.fat_100g ?? 0).toFixed(1),
    carbs: parseFloat(
      product.nutriments?.carbohydrates_100g ?? 0
    ).toFixed(1),
  },
});

// API объект с методами
export const foodApi = {
  // Поиск продуктов по запросу
  searchProducts: async (query, page = 1, pageSize = 10) => {
    const params = new URLSearchParams({
      search_terms: query,
      search_simple: 1,
      action: "process",
      json: 1,
      page_size: pageSize,
      page,
      fields: [
        "id",
        "code",
        "product_name",
        "brands",
        "quantity",
        "image_small_url",
        "nutriments",
      ].join(","),
      lc: "ru",
    });

    const response = await fetch(`${BASE_URL}/cgi/search.pl?${params}`);
    const data = await handleResponse(response);

    return {
      products: (data.products || [])
        .filter((p) => p.product_name)
        .map(normalizeProduct),
      total: data.count || 0,
      page: data.page || 1,
    };
  },

  // Получение продукта по штрихкоду
  getProductByBarcode: async (barcode) => {
    const response = await fetch(
      `${BASE_URL}/api/v0/product/${barcode}.json`
    );
    const data = await handleResponse(response);

    if (data.status !== 1) {
      throw new Error("Продукт не найден");
    }

    return normalizeProduct(data.product);
  },

  // Популярные категории (статика для UI)
  getCategories: async () => {
    const response = await fetch(
      `${BASE_URL}/categories.json`
    );
    const data = await handleResponse(response);
    return (data.tags || []).slice(0, 10);
  },
};