import "../styles/mealplan.css";

function MealPlan() {
  const plans = [
    {
      title: "Похудение",
      kcal: 1500,
      days: 30,
      tag: "Популярный",
      color: "plan-loss",
      img: "🥗",
    },
    {
      title: "Набор массы",
      kcal: 2800,
      days: 30,
      tag: "Для спортсменов",
      color: "plan-gain",
      img: "💪",
    },
    {
      title: "Поддержание",
      kcal: 2150,
      days: 30,
      tag: "Сбалансированный",
      color: "plan-keep",
      img: "⚖️",
    },
    {
      title: "Вегетарианский",
      kcal: 1900,
      days: 30,
      tag: "Без мяса",
      color: "plan-veg",
      img: "🥦",
    },
    {
      title: "Кето диета",
      kcal: 1800,
      days: 30,
      tag: "Низкоуглеводный",
      color: "plan-keto",
      img: "🥑",
    },
    {
      title: "Средиземноморский",
      kcal: 2000,
      days: 30,
      tag: "Здоровый",
      color: "plan-med",
      img: "🐟",
    },
  ];

  return (
    <div className="mealplan-page">
      <div className="page-header">
        <h1>Планы питания</h1>
        <p>Выбери готовый рацион под свою цель</p>
      </div>

      <div className="filters">
        <button className="filter-chip active">Все</button>
        <button className="filter-chip">Похудение</button>
        <button className="filter-chip">Набор массы</button>
        <button className="filter-chip">Вегетарианское</button>
        <button className="filter-chip">Кето</button>
      </div>

      <div className="plans-grid">
        {plans.map((p) => (
          <div key={p.title} className={`plan-card ${p.color}`}>
            <div className="plan-image">{p.img}</div>
            <span className="plan-tag">{p.tag}</span>
            <h3>{p.title}</h3>
            <div className="plan-meta">
              <div>
                <strong>{p.kcal}</strong>
                <span>ккал/день</span>
              </div>
              <div>
                <strong>{p.days}</strong>
                <span>дней</span>
              </div>
            </div>
            <button className="btn-primary btn-block">Выбрать план</button>
          </div>
        ))}
      </div>

      <section className="weekly-preview">
        <h2>Пример недельного меню</h2>
        <div className="week-grid">
          {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
            <div key={d} className="day-card">
              <h4>{d}</h4>
              <div className="day-meal">
                <span>🌅</span> Овсянка
              </div>
              <div className="day-meal">
                <span>☀️</span> Курица + рис
              </div>
              <div className="day-meal">
                <span>🌙</span> Рыба + овощи
              </div>
              <div className="day-total">~2150 ккал</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default MealPlan;