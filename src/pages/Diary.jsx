import { useState } from "react";
import FoodSearchModal from "../components/FoodSearchModal";
import "../styles/diary.css";

const initialMeals = [
  {
    type: "Завтрак",
    icon: "🌅",
    items: [
      { name: "Овсянка с ягодами", kcal: 280, weight: "200 г" },
      { name: "Кофе с молоком", kcal: 70, weight: "200 мл" },
    ],
  },
  { type: "Обед", icon: "☀️", items: [
    { name: "Куриная грудка на гриле", kcal: 320, weight: "180 г" },
    { name: "Рис бурый", kcal: 220, weight: "150 г" },
  ]},
  { type: "Перекус", icon: "🍎", items: [] },
  { type: "Ужин", icon: "🌙", items: [] },
];

function Diary() {
  const [meals, setMeals] = useState(initialMeals);
  const [modal, setModal] = useState({ open: false, mealType: null });

  const total = 2150;

  const consumed = meals.reduce(
    (sum, m) => sum + m.items.reduce((s, i) => s + i.kcal, 0),
    0
  );
  const remaining = total - consumed;
  const progress = Math.min((consumed / total) * 283, 283);

  const openModal = (mealType) => setModal({ open: true, mealType });
  const closeModal = () => setModal({ open: false, mealType: null });

  const handleAdd = (product) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.type === modal.mealType
          ? {
              ...meal,
              items: [
                ...meal.items,
                {
                  name: product.name,
                  kcal: product.nutrients.kcal,
                  weight: `${product.weight} г`,
                },
              ],
            }
          : meal
      )
    );
  };

  const removeItem = (mealType, index) => {
    setMeals((prev) =>
      prev.map((meal) =>
        meal.type === mealType
          ? { ...meal, items: meal.items.filter((_, i) => i !== index) }
          : meal
      )
    );
  };

  return (
    <div className="diary-page">
      <div className="page-header">
        <h1>Дневник питания</h1>
        <p>Среда, 13 мая 2026</p>
      </div>

      <div className="diary-summary">
        <div className="summary-card">
          <div className="summary-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" className="circle-bg" />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="circle-progress"
                style={{ strokeDashoffset: 283 - progress }}
              />
            </svg>
            <div className="circle-text">
              <strong>{consumed}</strong>
              <span>из {total} ккал</span>
            </div>
          </div>
          <div className="summary-info">
            <h3>
              {remaining > 0
                ? `Осталось ${remaining} ккал`
                : "Норма превышена!"}
            </h3>
            <div className="summary-macros">
              <div>
                <span className="dot dot-protein"></span> Белки
              </div>
              <div>
                <span className="dot dot-fat"></span> Жиры
              </div>
              <div>
                <span className="dot dot-carbs"></span> Углеводы
              </div>
            </div>
            <div className="api-info-badge">
              🔗 Данные из Open Food Facts API
            </div>
          </div>
        </div>

        <div className="water-card">
          <h3>💧 Вода</h3>
          <div className="water-glasses">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`glass ${i <= 5 ? "filled" : ""}`} />
            ))}
          </div>
          <p>5 из 8 стаканов</p>
        </div>
      </div>

      <div className="meals-list">
        {meals.map((meal) => {
          const mealKcal = meal.items.reduce((s, i) => s + i.kcal, 0);
          return (
            <div key={meal.type} className="meal-block">
              <div className="meal-header">
                <h3>
                  <span className="meal-icon">{meal.icon}</span>{" "}
                  {meal.type}
                </h3>
                <span className="meal-kcal">{mealKcal} ккал</span>
              </div>
              <div className="meal-items">
                {meal.items.length === 0 ? (
                  <p className="empty-meal">Нет добавленных продуктов</p>
                ) : (
                  meal.items.map((item, i) => (
                    <div key={i} className="food-item">
                      <div>
                        <strong>{item.name}</strong>
                        <span className="food-weight">{item.weight}</span>
                      </div>
                      <div className="food-item-right">
                        <span>{item.kcal} ккал</span>
                        <button
                          className="remove-btn"
                          onClick={() => removeItem(meal.type, i)}
                          title="Удалить"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button
                className="btn-add"
                onClick={() => openModal(meal.type)}
              >
                + Добавить продукт
              </button>
            </div>
          );
        })}
      </div>

      {modal.open && (
        <FoodSearchModal
          mealType={modal.mealType}
          onClose={closeModal}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
}

export default Diary;