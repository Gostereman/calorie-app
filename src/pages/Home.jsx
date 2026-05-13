import { Link } from "react-router-dom";
import Card from "../components/Card";
import "../styles/home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>
            Управляй своим <span className="accent">питанием</span> легко
          </h1>
          <p>
            Рассчитывай суточную норму калорий, веди дневник питания и
            планируй сбалансированный рацион — всё в одном приложении.
          </p>
          <div className="hero-buttons">
            <Link to="/calculator" className="btn-primary">
              Рассчитать калории
            </Link>
            <Link to="/meal-plan" className="btn-secondary">
              Посмотреть планы
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>10K+</strong>
              <span>пользователей</span>
            </div>
            <div>
              <strong>500+</strong>
              <span>продуктов</span>
            </div>
            <div>
              <strong>4.9</strong>
              <span>рейтинг</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">🍎 95 ккал</div>
          <div className="floating-card card-2">🥑 160 ккал</div>
          <div className="floating-card card-3">🥗 320 ккал</div>
          <div className="hero-circle"></div>
        </div>
      </section>

      <section className="features">
        <h2>Возможности приложения</h2>
        <div className="features-grid">
          <Card
            icon="🧮"
            title="Калькулятор калорий"
            description="Рассчитай свою суточную норму по формуле Миффлина-Сан Жеора"
          />
          <Card
            icon="📔"
            title="Дневник питания"
            description="Отслеживай съеденные калории и БЖУ каждый день"
          />
          <Card
            icon="🍽️"
            title="Готовые планы"
            description="Выбирай рацион под свою цель: похудение, набор, поддержание"
          />
          <Card
            icon="📊"
            title="Аналитика"
            description="Наглядные графики прогресса и достижения целей"
          />
          <Card
            icon="🥦"
            title="База продуктов"
            description="Более 500 продуктов с подробной пищевой ценностью"
          />
          <Card
            icon="⚡"
            title="Быстрый ввод"
            description="Добавляй приёмы пищи в один клик"
          />
        </div>
      </section>

      <section className="cta">
        <h2>Начни путь к здоровому питанию сегодня</h2>
        <Link to="/calculator" className="btn-primary btn-large">
          Попробовать бесплатно
        </Link>
      </section>
    </div>
  );
}

export default Home;