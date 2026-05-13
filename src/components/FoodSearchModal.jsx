import { useState } from "react";
import { useFoodSearch } from "../hooks/useFoodSearch";
import { useBarcode } from "../hooks/useBarcode";
import Loader from "./Loader";
import "../styles/foodsearch.css";

function FoodSearchModal({ onClose, onAdd, mealType }) {
  const [activeTab, setActiveTab] = useState("search");
  const [barcode, setBarcode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [weight, setWeight] = useState(100);

  const {
    query,
    setQuery,
    results,
    loading,
    error,
    total,
    hasMore,
    loadMore,
    reset,
  } = useFoodSearch();

  const {
    product: barcodeProduct,
    loading: barcodeLoading,
    error: barcodeError,
    fetchByBarcode,
  } = useBarcode();

  const handleAdd = () => {
    const product = selectedProduct || barcodeProduct;
    if (!product) return;

    const koef = weight / 100;

    onAdd({
      ...product,
      weight,
      nutrients: {
        kcal: Math.round(product.nutrients.kcal * koef),
        proteins: (product.nutrients.proteins * koef).toFixed(1),
        fats: (product.nutrients.fats * koef).toFixed(1),
        carbs: (product.nutrients.carbs * koef).toFixed(1),
      },
    });

    onClose();
  };

  const handleClose = () => {
    reset();
    setSelectedProduct(null);
    setBarcode("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>Добавить продукт в «{mealType}»</h3>
          <button className="modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === "search" ? "active" : ""}`}
            onClick={() => setActiveTab("search")}
          >
            🔍 Поиск
          </button>
          <button
            className={`tab-btn ${activeTab === "barcode" ? "active" : ""}`}
            onClick={() => setActiveTab("barcode")}
          >
            📦 По штрихкоду
          </button>
        </div>

        {/* Tab: Search */}
        {activeTab === "search" && (
          <div className="tab-content">
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Введите название продукта..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button className="clear-btn" onClick={reset}>
                  ✕
                </button>
              )}
            </div>

            {/* API статус */}
            <div className="api-badge">
              <span className="api-dot"></span>
              Open Food Facts API
              {total > 0 && (
                <span className="api-count">Найдено: {total}</span>
              )}
            </div>

            {/* Состояния */}
            {loading && results.length === 0 && (
              <Loader text="Поиск продуктов..." />
            )}

            {error && (
              <div className="error-state">
                <span>⚠️</span>
                <p>{error}</p>
                <button
                  className="btn-secondary"
                  onClick={() => setQuery(query)}
                >
                  Повторить
                </button>
              </div>
            )}

            {!loading && !error && query && results.length === 0 && (
              <div className="empty-state">
                <span>🥺</span>
                <p>Продукты не найдены. Попробуйте другой запрос.</p>
              </div>
            )}

            {!query && (
              <div className="empty-state">
                <span>🥗</span>
                <p>Начните вводить название продукта</p>
              </div>
            )}

            {/* Результаты */}
            <div className="results-list">
              {results.map((product) => (
                <div
                  key={product.id}
                  className={`result-item ${
                    selectedProduct?.id === product.id ? "selected" : ""
                  }`}
                  onClick={() =>
                    setSelectedProduct(
                      selectedProduct?.id === product.id ? null : product
                    )
                  }
                >
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <span>🍽️</span>
                    )}
                  </div>
                  <div className="product-info">
                    <strong>{product.name}</strong>
                    <span className="product-brand">{product.brand}</span>
                    <div className="product-nutrients">
                      <span className="kcal-badge">
                        {product.nutrients.kcal} ккал/100г
                      </span>
                      <span>Б: {product.nutrients.proteins}г</span>
                      <span>Ж: {product.nutrients.fats}г</span>
                      <span>У: {product.nutrients.carbs}г</span>
                    </div>
                  </div>
                  <div className="check-icon">
                    {selectedProduct?.id === product.id ? "✅" : ""}
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <button
                className="btn-secondary load-more"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? <Loader size="sm" text="" /> : "Загрузить ещё"}
              </button>
            )}
          </div>
        )}

        {/* Tab: Barcode */}
        {activeTab === "barcode" && (
          <div className="tab-content">
            <div className="barcode-input-group">
              <input
                type="text"
                placeholder="Введите штрихкод (например: 4607134110561)"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
              />
              <button
                className="btn-primary"
                onClick={() => fetchByBarcode(barcode)}
                disabled={barcodeLoading || !barcode}
              >
                Найти
              </button>
            </div>

            <div className="api-badge">
              <span className="api-dot"></span>
              Open Food Facts API · Barcode Search
            </div>

            {barcodeLoading && <Loader text="Поиск по штрихкоду..." />}

            {barcodeError && (
              <div className="error-state">
                <span>⚠️</span>
                <p>{barcodeError}</p>
              </div>
            )}

            {barcodeProduct && (
              <div className="barcode-result">
                <div className="result-item selected">
                  <div className="product-image">
                    {barcodeProduct.image ? (
                      <img
                        src={barcodeProduct.image}
                        alt={barcodeProduct.name}
                      />
                    ) : (
                      <span>🍽️</span>
                    )}
                  </div>
                  <div className="product-info">
                    <strong>{barcodeProduct.name}</strong>
                    <span className="product-brand">
                      {barcodeProduct.brand}
                    </span>
                    <div className="product-nutrients">
                      <span className="kcal-badge">
                        {barcodeProduct.nutrients.kcal} ккал/100г
                      </span>
                    </div>
                  </div>
                  <div className="check-icon">✅</div>
                </div>

                <div className="nutrients-table">
                  <h4>Пищевая ценность на 100г</h4>
                  <div className="nutrients-grid">
                    <div className="nutrient-cell">
                      <strong>{barcodeProduct.nutrients.kcal}</strong>
                      <span>ккал</span>
                    </div>
                    <div className="nutrient-cell">
                      <strong>{barcodeProduct.nutrients.proteins}г</strong>
                      <span>Белки</span>
                    </div>
                    <div className="nutrient-cell">
                      <strong>{barcodeProduct.nutrients.fats}г</strong>
                      <span>Жиры</span>
                    </div>
                    <div className="nutrient-cell">
                      <strong>{barcodeProduct.nutrients.carbs}г</strong>
                      <span>Углеводы</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer (если выбран продукт) */}
        {(selectedProduct || barcodeProduct) && (
          <div className="modal-footer">
            <div className="weight-input">
              <label>Вес (граммы)</label>
              <input
                type="number"
                value={weight}
                min={1}
                max={5000}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            <div className="footer-kcal">
              {Math.round(
                ((selectedProduct || barcodeProduct).nutrients.kcal *
                  weight) /
                  100
              )}{" "}
              ккал
            </div>
            <button className="btn-primary" onClick={handleAdd}>
              + Добавить
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodSearchModal;