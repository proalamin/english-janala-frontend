import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../language";

export default function LoginRequired() {
  const { t } = useLanguage();
  const location = useLocation();

  return (
    <div className="empty-state card login-required-card">
      <h3>🔒 {t("loginRequiredTitle")}</h3>
      <p>{t("loginRequiredCopy")}</p>
      <div className="button-row">
        <Link className="btn btn-primary" to="/login" state={{ from: location.pathname }}>
          {t("login")}
        </Link>
        <Link className="btn btn-outline" to="/register">
          {t("register")}
        </Link>
      </div>
    </div>
  );
}
