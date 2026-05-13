import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import Diary from "./pages/Diary";
import MealPlan from "./pages/MealPlan";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/calorie-app" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/meal-plan" element={<MealPlan />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;