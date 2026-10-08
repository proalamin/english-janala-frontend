import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useAuth } from "../auth";
import { useLanguage } from "../language";
import SegmentCard from "../components/SegmentCard";

function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="m2 13 10 5 10-5" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  );
}

function StatCardLink({ to, children }) {
  const className = "card stat-card-v2 stat-card-link";
  if (to.startsWith("#")) {
    return (
      <a className={className} href={to}>
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={to}>
      {children}
    </Link>
  );
}

export default function StudentDashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/progress/summary/");
        setSummary(response.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, []);

  if (loading) {
    return <p className="status-message">{t("loadingVocabulary")}</p>;
  }

  if (error) {
    return <p className="status-message error">{error}</p>;
  }

  const segmentsStarted = summary.segments.filter((s) => (s.known_count || 0) > 0).length;

  const wordsLearnedTarget =
    summary.recent_words.length > 0 ? "#recently-learned" : "/student/segments";

  const inProgressTarget =
    summary.in_progress_bundles.length === 1
      ? `/student/bundles/${summary.in_progress_bundles[0].id}/practice`
      : summary.in_progress_bundles.length > 1
        ? "#continue-learning"
        : "/student/segments";

  const completedTarget =
    summary.completed_bundles.length === 1
      ? `/student/bundles/${summary.completed_bundles[0].id}/practice`
      : summary.completed_bundles.length > 1
        ? "#completed-bundles"
        : "/student/segments";

  return (
    <section className="student-dashboard">
      <div className="admin-welcome">
        <div>
          <h2>{t("welcomeBack")}, {user?.name || user?.email}</h2>
          <p className="muted-text">{t("studentDashboardCopy")}</p>
        </div>
        <div className="button-row">
          <Link className="btn btn-primary" to="/student/segments">
            {t("browseLessons")}
          </Link>
        </div>
      </div>

      <div className="stat-grid">
        <StatCardLink to={wordsLearnedTarget}>
          <div className="stat-card-top">
            <span className="stat-label">{t("wordsLearned")}</span>
            <span className="stat-icon-badge"><IconBook /></span>
          </div>
          <strong className="stat-value">{summary.total_known}</strong>
          <span className="stat-sub">{t("of")} {summary.total_words} · {summary.progress_percent}%</span>
        </StatCardLink>

        <StatCardLink to="/student/segments">
          <div className="stat-card-top">
            <span className="stat-label">{t("segments")}</span>
            <span className="stat-icon-badge"><IconLayers /></span>
          </div>
          <strong className="stat-value">{segmentsStarted}</strong>
          <span className="stat-sub">{t("of")} {summary.segments.length} {t("started")}</span>
        </StatCardLink>

        <StatCardLink to={inProgressTarget}>
          <div className="stat-card-top">
            <span className="stat-label">{t("inProgress")}</span>
            <span className="stat-icon-badge"><IconClock /></span>
          </div>
          <strong className="stat-value">{summary.in_progress_bundles.length}</strong>
          <span className="stat-sub">{t("bundlesLabel")}</span>
        </StatCardLink>

        <StatCardLink to={completedTarget}>
          <div className="stat-card-top">
            <span className="stat-label">{t("completed")}</span>
            <span className="stat-icon-badge"><IconCheck /></span>
          </div>
          <strong className="stat-value">{summary.completed_bundles.length}</strong>
          <span className="stat-sub">{t("bundlesLabel")}</span>
        </StatCardLink>
      </div>

      {summary.in_progress_bundles.length > 0 ? (
        <div className="dashboard-section" id="continue-learning">
          <div className="section-heading">
            <h3>{t("continueLearning")}</h3>
          </div>
          <div className="segment-overview-list">
            {summary.in_progress_bundles.map((bundle) => (
              <Link
                className="card segment-overview-row"
                to={`/student/bundles/${bundle.id}/practice`}
                key={bundle.id}
              >
                <div className="segment-overview-info">
                  <strong>{bundle.title}</strong>
                  <span className="muted-text">{bundle.segment_name}</span>
                </div>
                <div className="bundle-progress segment-overview-progress">
                  <div className="bundle-progress-track">
                    <div
                      className="bundle-progress-fill"
                      style={{ width: `${bundle.progress_percent}%` }}
                    />
                  </div>
                  <span className="bundle-progress-label">
                    {bundle.known_count}/{bundle.vocabulary_count} {t("wordsLearned")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {summary.completed_bundles.length > 0 ? (
        <div className="dashboard-section" id="completed-bundles">
          <div className="section-heading">
            <h3>{t("completed")}</h3>
          </div>
          <div className="segment-overview-list">
            {summary.completed_bundles.map((bundle) => (
              <Link
                className="card segment-overview-row"
                to={`/student/bundles/${bundle.id}/practice`}
                key={bundle.id}
              >
                <div className="segment-overview-info">
                  <strong>{bundle.title}</strong>
                  <span className="muted-text">{bundle.segment_name}</span>
                </div>
                <div className="bundle-progress segment-overview-progress">
                  <div className="bundle-progress-track">
                    <div
                      className="bundle-progress-fill"
                      style={{ width: `${bundle.progress_percent}%` }}
                    />
                  </div>
                  <span className="bundle-progress-label">
                    {bundle.known_count}/{bundle.vocabulary_count} {t("wordsLearned")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="dashboard-section">
        <div className="section-heading">
          <h3>{t("yourSegments")}</h3>
          <Link className="text-link" to="/student/segments">
            {t("viewAll")}
          </Link>
        </div>
        <div className="grid two-column-grid">
          {summary.segments.map((segment) => (
            <SegmentCard key={segment.id} segment={segment} />
          ))}
        </div>
      </div>

      {summary.recent_words.length > 0 ? (
        <div className="dashboard-section" id="recently-learned">
          <div className="section-heading">
            <h3>{t("recentlyLearned")}</h3>
          </div>
          <div className="card side-panel">
            <ul className="side-list">
              {summary.recent_words.map((word) => (
                <li key={word.id}>
                  <Link to={`/student/vocabulary/${word.id}`} className="side-list-link">
                    <span className="side-list-icon"><IconBook /></span>
                    <span className="side-list-text">
                      <strong>{word.word}</strong>
                      <small>{word.meaning} · {word.lesson_title}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}
