
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import HotelMenuPage from "./components/HotelMenuPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/hotel/menu/:id"
          element={<HotelMenuPage />}
        />
      </Routes>
    </HashRouter>
  );
}
