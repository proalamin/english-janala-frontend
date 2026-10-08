import { Link } from "react-router-dom";
import { useLanguage } from "../language";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <section className="not-found-page">
      <div className="card not-found-card">
        <span className="not-found-code">404</span>
        <h2>{t("notFoundTitle")}</h2>
        <p className="muted-text">{t("notFoundCopy")}</p>
        <div className="button-row">
          <Link className="btn btn-primary" to="/">
            {t("backToHome")}
          </Link>
          <Link className="btn btn-outline" to="/student/segments">
            {t("browseLessons")}
          </Link>
        </div>
      </div>
    </section>
  );
}
