import { Link, NavLink, Outlet } from "react-router-dom";
import { useLanguage } from "../language";

function IconDashboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="m2 13 10 5 10-5" />
      <path d="m2 18 10 5 10-5" />
    </svg>
  );
}

function IconBundles() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17.5" cy="8.5" r="2.6" />
      <path d="M16 14.3c2.7.5 5.5 2.3 5.5 5.7" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

const navLinkClass = ({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`;

export default function AdminLayout() {
  const { t } = useLanguage();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand">
          <span className="brand-mark">EJ</span>
          <span className="brand-text">
            <strong>English Janala</strong>
            <small>{t("adminPanel")}</small>
          </span>
        </Link>

        <nav className="admin-nav">
          <NavLink to="/admin" end className={navLinkClass}>
            <IconDashboard />
            {t("dashboard")}
          </NavLink>
          <NavLink to="/admin/segments" className={navLinkClass}>
            <IconLayers />
            {t("segments")}
          </NavLink>
          <NavLink to="/admin/bundles" className={navLinkClass}>
            <IconBundles />
            {t("bundlesLabel")}
          </NavLink>
          <NavLink to="/admin/vocabulary" className={navLinkClass}>
            <IconBook />
            {t("vocabulary")}
          </NavLink>
          <NavLink to="/student/segments" className={navLinkClass}>
            <IconUsers />
            {t("studentView")}
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-back-card">
            <span className="admin-back-icon">
              <IconHome />
            </span>
            <span>
              <strong>{t("backToSite")}</strong>
              <small>{t("backToSiteCopy")}</small>
            </span>
          </Link>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
