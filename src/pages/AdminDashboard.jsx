import { Link } from "react-router-dom";
import { useLanguage } from "../language";

export default function AdminDashboard() {
  const { t } = useLanguage();

  return (
    <section className="form-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("admin")}</span>
          <h2>{t("contentManagement")}</h2>
          <p className="muted-text">{t("adminDashboardCopy")}</p>
        </div>
      </div>

      <div className="grid two-column-grid">
        <article className="card">
          <h3>{t("lessons")}</h3>
          <p className="muted-text">{t("lessonAdminCopy")}</p>
          <div className="button-row">
            <Link className="btn btn-primary" to="/admin/lessons">
              {t("manageLessons")}
            </Link>
            <Link className="btn btn-outline" to="/admin/lessons/new">
              {t("addLesson")}
            </Link>
          </div>
        </article>

        <article className="card">
          <h3>{t("vocabulary")}</h3>
          <p className="muted-text">{t("vocabularyAdminCopy")}</p>
          <div className="button-row">
            <Link className="btn btn-primary" to="/admin/vocabulary">
              {t("manageVocabulary")}
            </Link>
            <Link className="btn btn-outline" to="/admin/vocabulary/new">
              {t("addVocabulary")}
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
