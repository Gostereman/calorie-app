import { NavLink } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="logo">
          <span className="logo-icon">🥗</span>
          <span className="logo-text">NutriPlan</span>
        </NavLink>
        <nav className="nav-links">
          <NavLink to="/" end>
            Главная
          </NavLink>
          <NavLink to="/calculator">Калькулятор</NavLink>
          <NavLink to="/diary">Дневник</NavLink>
          <NavLink to="/meal-plan">План питания</NavLink>
          <NavLink to="/profile">Профиль</NavLink>
        </nav>
        <button className="btn-primary">Войти</button>
      </div>
    </header>
  );
}

export default Navbar;