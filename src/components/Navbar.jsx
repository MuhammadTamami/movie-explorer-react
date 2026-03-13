import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useFavorites } from "../context/FavoritesContext";
import { useState } from "react";

export default function Navbar() {
  const { dark, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${query}`);
    setQuery("");
    setMenuOpen(false); // close menu on search
  };

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* LEFT */}
        <div className="nav-left">
          <Link to="/" className="logo">🎬 Movie Explorer</Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">Discover</Link>
            <Link to="/favorites" className="nav-link">Favorites</Link>
          </div>
        </div>

        {/* SEARCH DESKTOP */}
        <div className="nav-center">
          <form className="nav-search desktop-search" onSubmit={handleSearch}>
            <input
              placeholder="Search shows..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>

        {/* RIGHT */}
        <div className="nav-right">

          <Link to="/favorites" className="favorite-btn">
            ❤️
            {favorites.length > 0 && (
              <span className="favorite-count">{favorites.length}</span>
            )}
          </Link>

          <button onClick={toggleTheme} className="theme-toggle">
            {dark ? "☀️" : "🌙"}
          </button>

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>

        <Link to="/" className="nav-link">Discover</Link>

        <Link to="/favorites" className="nav-link">Favorites</Link>

        <form className="nav-search mobile-search" onSubmit={handleSearch}>
          <input
            placeholder="Search shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

      </div>

    </header>
  );
}