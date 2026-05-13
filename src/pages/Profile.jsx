import "../styles/profile.css";

function Profile() {
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="avatar">АИ</div>
        <div>
          <h1>Анна Иванова</h1>
          <p>anna@example.com · С нами с января 2026</p>
        </div>
        <button className="btn-secondary">Редактировать</button>
      </div>

      <div className="profile-grid">
        <div className="profile-section">
          <h3>Личные данные</h3>
          <div className="info-row">
            <span>Возраст</span>
            <strong>27 лет</strong>
          </div>
          <div className="info-row">
            <span>Рост</span>
            <strong>168 см</strong>
          </div>
          <div className="info-row">
            <span>Вес</span>
            <strong>62 кг</strong>
          </div>
          <div className="info-row">
            <span>Цель</span>
            <strong>Поддержание веса</strong>
          </div>
          <div className="info-row">
            <span>Активность</span>
            <strong>Средняя</strong>
          </div>
        </div>

        <div className="profile-section">
          <h3>Достижения</h3>
          <div className="achievements">
            <div className="achievement">
              <span className="achievement-icon">🔥</span>
              <strong>14 дней</strong>
              <p>Серия записей</p>
            </div>
            <div className="achievement">
              <span className="achievement-icon">🏆</span>
              <strong>Цель</strong>
              <p>Достигнута 3 раза</p>
            </div>
            <div className="achievement">
              <span className="achievement-icon">💧</span>
              <strong>2 л</strong>
              <p>Воды в день</p>
            </div>
            <div className="achievement">
              <span className="achievement-icon">⭐</span>
              <strong>Pro</strong>
              <p>Активный пользователь</p>
            </div>
          </div>
        </div>

        <div className="profile-section profile-stats">
          <h3>Статистика за неделю</h3>
          <div className="chart">
            {[60, 80, 45, 90, 70, 85, 65].map((v, i) => (
              <div key={i} className="bar-wrapper">
                <div className="bar" style={{ height: `${v}%` }}></div>
                <span>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}</span>
              </div>
            ))}
          </div>
          <div className="stats-row">
            <div>
              <strong>14 850</strong>
              <span>ккал за неделю</span>
            </div>
            <div>
              <strong>2 121</strong>
              <span>средний день</span>
            </div>
            <div>
              <strong>98%</strong>
              <span>выполнение цели</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Настройки</h3>
          <div className="setting-row">
            <span>Уведомления</span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-row">
            <span>Напоминания о воде</span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-row">
            <span>Тёмная тема</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;