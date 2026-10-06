import { Link } from "react-router-dom";
import { useLanguage } from "../language";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-about">
          <Link to="/" className="footer-brand-block">
            <span className="footer-mark">EJ</span>
            <span>
              <strong>English Janala</strong>
              <small>{t("appSubtitle")}</small>
            </span>
          </Link>
          <p>
            {t("projectLine")}
          </p>
        </div>

        <div className="footer-column">
          <h3>{t("learnVocabulary")}</h3>
          <Link to="/student/lessons">{t("browseLessons")}</Link>
          <Link to="/student/vocabulary">{t("searchVocabulary")}</Link>
          <Link to="/student/learn-cards">{t("practiceVocabulary")}</Link>
        </div>

        <div className="footer-column">
          <h3>{t("admin")}</h3>
          <Link to="/admin">{t("adminPanel")}</Link>
          <Link to="/admin/lessons">{t("manageLessons")}</Link>
          <Link to="/admin/vocabulary">{t("manageVocabulary")}</Link>
          <span className="footer-url">/admin</span>
        </div>

        <div className="footer-column">
          <h3>{t("project")}</h3>
          <span>{t("techStack")}</span>
          <span>{t("mysqlDatabase")}</span>
          <span>{t("week3Scope")}</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>UU Dev Nest Database Management System Project</span>
        <span>{t("builtFor")}</span>
      </div>
    </footer>
  );
}
