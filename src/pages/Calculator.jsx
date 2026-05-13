import { useState } from "react";
import "../styles/calculator.css";

// Коэффициенты активности
const ACTIVITY_LEVELS = [
  { label: "Минимальный (сидячая работа)", value: 1.2 },
  { label: "Низкий (тренировки 1–2 раза в неделю)", value: 1.375 },
  { label: "Средний (тренировки 3–5 раз в неделю)", value: 1.55 },
  { label: "Высокий (тренировки 6–7 раз в неделю)", value: 1.725 },
  { label: "Очень высокий (физический труд)", value: 1.9 },
];

// Коэффициенты цели
const GOAL_MODIFIERS = {
  loss: { label: "Похудение", icon: "📉", modifier: 0.8 },
  maintain: { label: "Поддержание", icon: "⚖️", modifier: 1.0 },
  gain: { label: "Набор массы", icon: "📈", modifier: 1.15 },
};

const INITIAL_FORM = {
  gender: "male",
  age: "",
  height: "",
  weight: "",
  activity: 1.2,
  goal: "maintain",
};

function calculate(form) {
  const { gender, age, height, weight, activity, goal } = form;
  const a = Number(age);
  const h = Number(height);
  const w = Number(weight);

  // Формула Миффлина-Сан Жеора
  const bmr =
    gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

  const tdee = bmr * activity;
  const target = tdee * GOAL_MODIFIERS[goal].modifier;

  // Макронутриенты (30% Б / 25% Ж / 45% У)
  const proteins = Math.round((target * 0.3) / 4);
  const fats = Math.round((target * 0.25) / 9);
  const carbs = Math.round((target * 0.45) / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    target: Math.round(target),
    proteins,
    fats,
    carbs,
    proteinPct: 30,
    fatPct: 25,
    carbPct: 45,
  };
}

function validate(form) {
  const errors = {};

  if (!form.age) {
    errors.age = "Укажите возраст";
  } else if (form.age < 10 || form.age > 120) {
    errors.age = "Возраст: 10–120 лет";
  }

  if (!form.height) {
    errors.height = "Укажите рост";
  } else if (form.height < 100 || form.height > 250) {
    errors.height = "Рост: 100–250 см";
  }

  if (!form.weight) {
    errors.weight = "Укажите вес";
  } else if (form.weight < 30 || form.weight > 300) {
    errors.weight = "Вес: 30–300 кг";
  }

  return errors;
}

// Кольцевой прогресс
function RingChart({ proteins, fats, carbs }) {
  const r = 80;
  const circ = 2 * Math.PI * r;
  const total = proteins + fats + carbs;

  const proteinDash = (proteins / total) * circ;
  const fatDash = (fats / total) * circ;
  const carbDash = (carbs / total) * circ;

  const gap = 4;

  return (
    <svg viewBox="0 0 200 200" className="ring-chart">
      {/* Белки — синий */}
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="#ff6b6b"
        strokeWidth="20"
        strokeDasharray={`${proteinDash - gap} ${circ - proteinDash + gap}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      {/* Жиры — жёлтый */}
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="#ffd93d"
        strokeWidth="20"
        strokeDasharray={`${fatDash - gap} ${circ - fatDash + gap}`}
        strokeDashoffset={circ / 4 - proteinDash}
        strokeLinecap="round"
      />
      {/* Углеводы — зелёный */}
      <circle
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="#4caf7d"
        strokeWidth="20"
        strokeDasharray={`${carbDash - gap} ${circ - carbDash + gap}`}
        strokeDashoffset={circ / 4 - proteinDash - fatDash}
        strokeLinecap="round"
      />
    </svg>
  );
}

// Анимированный счётчик
function AnimatedNumber({ value }) {
  return <span className="animated-number">{value.toLocaleString("ru-RU")}</span>;
}

function Calculator() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
    // Пересчёт на лету, если был уже результат
    if (submitted) {
      const updated = { ...form, [field]: value };
      const errs = validate(updated);
      if (Object.keys(errs).length === 0) {
        setResult(calculate(updated));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      setResult(calculate(form));
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setResult(null);
    setSubmitted(false);
  };

  const bmi = form.height && form.weight
    ? (Number(form.weight) / Math.pow(Number(form.height) / 100, 2)).toFixed(1)
    : null;

  const bmiCategory = (val) => {
    if (val < 18.5) return { label: "Дефицит", color: "#4dabf7" };
    if (val < 25) return { label: "Норма", color: "#4caf7d" };
    if (val < 30) return { label: "Избыток", color: "#ffa94d" };
    return { label: "Ожирение", color: "#ff6b6b" };
  };

  return (
    <div className="calculator-page">
      <div className="page-header">
        <h1>Калькулятор калорий</h1>
        <p>Расчёт по формуле Миффлина-Сан Жеора</p>
      </div>

      <div className={`calculator-container ${result ? "has-result" : ""}`}>
        {/* Форма */}
        <form className="calc-form" onSubmit={handleSubmit}>
          {/* Пол */}
          <div className="form-group">
            <label>Пол</label>
            <div className="radio-group">
              <label
                className={`radio-card ${form.gender === "male" ? "checked" : ""}`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={form.gender === "male"}
                  onChange={() => set("gender", "male")}
                />
                <span>👨</span>
                Мужчина
              </label>
              <label
                className={`radio-card ${form.gender === "female" ? "checked" : ""}`}
              >
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={form.gender === "female"}
                  onChange={() => set("gender", "female")}
                />
                <span>👩</span>
                Женщина
              </label>
            </div>
          </div>

          {/* Возраст, рост, вес */}
          <div className="form-row">
            <div className="form-group">
              <label>Возраст</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  placeholder="25"
                  value={form.age}
                  min={10}
                  max={120}
                  onChange={(e) => set("age", e.target.value)}
                  className={errors.age ? "error" : ""}
                />
                <span className="input-unit">лет</span>
              </div>
              {errors.age && <p className="field-error">{errors.age}</p>}
            </div>

            <div className="form-group">
              <label>Рост</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  placeholder="175"
                  value={form.height}
                  min={100}
                  max={250}
                  onChange={(e) => set("height", e.target.value)}
                  className={errors.height ? "error" : ""}
                />
                <span className="input-unit">см</span>
              </div>
              {errors.height && (
                <p className="field-error">{errors.height}</p>
              )}
            </div>

            <div className="form-group">
              <label>Вес</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  placeholder="70"
                  value={form.weight}
                  min={30}
                  max={300}
                  onChange={(e) => set("weight", e.target.value)}
                  className={errors.weight ? "error" : ""}
                />
                <span className="input-unit">кг</span>
              </div>
              {errors.weight && (
                <p className="field-error">{errors.weight}</p>
              )}
            </div>
          </div>

          {/* ИМТ */}
          {bmi && (
            <div
              className="bmi-bar"
              style={{ "--bmi-color": bmiCategory(bmi).color }}
            >
              <span>
                ИМТ: <strong>{bmi}</strong> —{" "}
                <span style={{ color: bmiCategory(bmi).color }}>
                  {bmiCategory(bmi).label}
                </span>
              </span>
              <div className="bmi-scale">
                <div className="bmi-pointer" style={{ left: `${Math.min(Math.max(((bmi - 10) / 30) * 100, 0), 100)}%` }} />
              </div>
            </div>
          )}

          {/* Активность */}
          <div className="form-group">
            <label>Уровень активности</label>
            <select
              value={form.activity}
              onChange={(e) => set("activity", Number(e.target.value))}
            >
              {ACTIVITY_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* Цель */}
          <div className="form-group">
            <label>Цель</label>
            <div className="goal-group">
              {Object.entries(GOAL_MODIFIERS).map(([key, val]) => (
                <label
                  key={key}
                  className={`goal-card ${form.goal === key ? "checked" : ""}`}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={key}
                    checked={form.goal === key}
                    onChange={() => set("goal", key)}
                  />
                  <span className="goal-icon">{val.icon}</span>
                  <strong>{val.label}</strong>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary btn-block">
              Рассчитать
            </button>
            {result && (
              <button
                type="button"
                className="btn-secondary btn-block"
                onClick={handleReset}
              >
                Сбросить
              </button>
            )}
          </div>
        </form>

        {/* Результат */}
        {result && (
          <div className="calc-result">
            {/* Главное число */}
            <div className="result-hero">
              <p className="result-label">Суточная норма калорий</p>
              <div className="result-main">
                <AnimatedNumber value={result.target} />
                <span className="result-unit">ккал</span>
              </div>
              <span className="result-goal-badge">
                {GOAL_MODIFIERS[form.goal].icon}{" "}
                {GOAL_MODIFIERS[form.goal].label}
              </span>
            </div>

            {/* Разбивка */}
            <div className="result-breakdown">
              <div className="breakdown-item">
                <span>Базовый обмен (BMR)</span>
                <strong>{result.bmr.toLocaleString("ru-RU")} ккал</strong>
              </div>
              <div className="breakdown-item">
                <span>С учётом активности (TDEE)</span>
                <strong>{result.tdee.toLocaleString("ru-RU")} ккал</strong>
              </div>
              <div className="breakdown-item highlight">
                <span>Цель ({GOAL_MODIFIERS[form.goal].label})</span>
                <strong>
                  {result.target.toLocaleString("ru-RU")} ккал
                </strong>
              </div>
            </div>

            {/* Кольцо + макронутриенты */}
            <div className="macros-section">
              <div className="ring-wrapper">
                <RingChart
                  proteins={result.proteins}
                  fats={result.fats}
                  carbs={result.carbs}
                />
              </div>

              <div className="macros">
                <div className="macro macro-protein">
                  <div className="macro-header">
                    <span className="macro-dot" style={{ background: "#ff6b6b" }} />
                    <span className="macro-label">Белки</span>
                    <span className="macro-pct">{result.proteinPct}%</span>
                  </div>
                  <strong className="macro-value">{result.proteins} г</strong>
                  <div className="macro-bar">
                    <div
                      className="macro-fill protein-fill"
                      style={{ width: `${result.proteinPct}%` }}
                    />
                  </div>
                </div>

                <div className="macro macro-fat">
                  <div className="macro-header">
                    <span className="macro-dot" style={{ background: "#ffd93d" }} />
                    <span className="macro-label">Жиры</span>
                    <span className="macro-pct">{result.fatPct}%</span>
                  </div>
                  <strong className="macro-value">{result.fats} г</strong>
                  <div className="macro-bar">
                    <div
                      className="macro-fill fat-fill"
                      style={{ width: `${result.fatPct}%` }}
                    />
                  </div>
                </div>

                <div className="macro macro-carbs">
                  <div className="macro-header">
                    <span className="macro-dot" style={{ background: "#4caf7d" }} />
                    <span className="macro-label">Углеводы</span>
                    <span className="macro-pct">{result.carbPct}%</span>
                  </div>
                  <strong className="macro-value">{result.carbs} г</strong>
                  <div className="macro-bar">
                    <div
                      className="macro-fill carb-fill"
                      style={{ width: `${result.carbPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Приёмы пищи */}
            <div className="meal-split">
              <h4>Распределение по приёмам пищи</h4>
              <div className="meal-split-grid">
                {[
                  { name: "Завтрак", icon: "🌅", pct: 0.25 },
                  { name: "Обед", icon: "☀️", pct: 0.35 },
                  { name: "Перекус", icon: "🍎", pct: 0.1 },
                  { name: "Ужин", icon: "🌙", pct: 0.3 },
                ].map((m) => (
                  <div key={m.name} className="meal-split-item">
                    <span>{m.icon}</span>
                    <strong>{m.name}</strong>
                    <span className="split-kcal">
                      {Math.round(result.target * m.pct)} ккал
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className="result-tip">
              💡 Расчёт по формуле Миффлина-Сан Жеора. Результат
              является рекомендательным.
            </p>
          </div>
        )}

        {/* Пустой placeholder */}
        {!result && (
          <div className="result-placeholder">
            <div className="placeholder-icon">🧮</div>
            <h3>Заполните форму</h3>
            <p>Введите свои параметры и нажмите «Рассчитать»</p>
            <ul className="formula-info">
              <li>
                <strong>Мужчины: </strong>10×вес + 6.25×рост – 5×возраст + 5
              </li>
              <li>
                <strong>Женщины: </strong>10×вес + 6.25×рост – 5×возраст – 161
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Calculator;