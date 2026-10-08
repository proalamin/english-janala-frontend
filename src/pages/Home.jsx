import { Link } from "react-router-dom";
import { useLanguage } from "../language";

export default function Home() {
  const { t } = useLanguage();

  return (
    <section className="home-page">
      <div className="hero">
        <div className="hero-content">
          <span className="eyebrow">{t("vocabularyPlatform")}</span>
          <h1>English Janala</h1>
          <p>{t("heroCopy")}</p>

          <div className="button-row">
            <Link to="/student/segments" className="btn btn-primary">
              {t("startLearning")}
            </Link>
          </div>
        </div>

        <div className="hero-panel card">
          <span className="eyebrow">{t("forStudents")}</span>
          <h2>{t("learnSimpleSteps")}</h2>
          <div className="learning-steps">
            <div>
              <strong>1</strong>
              <span>{t("chooseLesson")}</span>
            </div>
            <div>
              <strong>2</strong>
              <span>{t("readVocabulary")}</span>
            </div>
            <div>
              <strong>3</strong>
              <span>{t("searchReview")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="home-grid">
        <article className="card feature-card">
          <span className="pill">{t("segments")}</span>
          <h3>{t("organizedVocabulary")}</h3>
          <p>{t("lessonsFeatureCopy")}</p>
          <Link className="text-link" to="/student/segments">
            {t("viewLessons")}
          </Link>
        </article>


      </div>
    </section>
  );
}
