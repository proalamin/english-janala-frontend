import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useLanguage } from "../language";

const navLinkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">EJ</span>
          <span className="brand-text">
            <strong>English Janala</strong>
            <small>{t("appSubtitle")}</small>
          </span>
        </Link>

        <button
          className="menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={t("toggleNavigation")}
        >
          ☰
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            {t("home")}
          </NavLink>
          <NavLink
            to="/student/segments"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            {t("segments")}
          </NavLink>
          <NavLink
            to="/student/vocabulary"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            {t("learnVocabulary")}
          </NavLink>
          <NavLink
            to="/student/learn-cards"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            {t("practiceVocabulary")}
          </NavLink>
          <button className="language-toggle" type="button" onClick={toggleLanguage}>
            <span>{t("language")}</span>
            <strong>{language === "en" ? "বাংলা" : "EN"}</strong>
          </button>
        </nav>
      </div>
    </header>
  );
}
