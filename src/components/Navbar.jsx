import { useEffect, useState } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../language";
import { useAuth } from "../auth";

const navLinkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate("/");
  }

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
          className={`menu-button ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen((value) => !value)}
          aria-label={t("toggleNavigation")}
          aria-expanded={menuOpen}
        >
          <span className="menu-button-bar" />
          <span className="menu-button-bar" />
          <span className="menu-button-bar" />
        </button>

        {menuOpen ? (
          <button
            type="button"
            className="nav-backdrop"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
          />
        ) : null}

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            {t("home")}
          </NavLink>
          {user && !isAdmin ? (
            <NavLink
              to="/student/dashboard"
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {t("dashboard")}
            </NavLink>
          ) : null}
          <NavLink
            to="/student/segments"
            className={navLinkClass}
            onClick={() => setMenuOpen(false)}
          >
            {t("segments")}
          </NavLink>
          <NavLink
            to="/student/segments"
            className="nav-link nav-cta"
            onClick={() => setMenuOpen(false)}
          >
            {t("startLearning")}
          </NavLink>
          {isAdmin ? (
            <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              {t("admin")}
            </NavLink>
          ) : null}

          {user ? (
            <div className="navbar-account">
              <span className="navbar-user-name">{user.name || user.email}</span>
              <button className="btn btn-outline navbar-logout" type="button" onClick={handleLogout}>
                {t("logout")}
              </button>
            </div>
          ) : (
            <div className="navbar-account">
              <Link className="btn btn-outline navbar-register" to="/login" onClick={() => setMenuOpen(false)}>
                {t("login")}
              </Link>
            </div>
          )}

          <button className="language-toggle" type="button" onClick={toggleLanguage}>
            <span>{t("language")}</span>
            <strong>{language === "en" ? "বাংলা" : "EN"}</strong>
          </button>
        </nav>
      </div>
    </header>
  );
}
