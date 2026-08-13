import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const navLinkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">EJ</span>
          <span className="brand-text">
            <strong>English Janala</strong>
            <small>Vocabulary learning app</small>
          </span>
        </Link>

        <button
          className="menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/student/lessons"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Lessons
          </NavLink>
          <NavLink
            to="/student/vocabulary"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Learn Vocabulary
          </NavLink>
          <NavLink
            to="/student/learn-cards"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            Practice Vocabulary
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
