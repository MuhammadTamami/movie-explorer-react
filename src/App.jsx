import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Discover from "./pages/Discover.jsx";
import Search from "./pages/Search.jsx";
import Detail from "./pages/Detail.jsx";
import Favorites from "./pages/Favorites.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";

export default function App() {
  return (
    <>
      <ThemeProvider>
        <FavoritesProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/search" element={<Search />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FavoritesProvider>
      </ThemeProvider>
    </>
  );
}