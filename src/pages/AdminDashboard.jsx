import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

const DIFFICULTIES = ["easy", "medium", "hard"];

function IconSegments() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="m2 13 10 5 10-5" />
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

function IconWords() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 15v3" />
      <path d="M12 10v8" />
      <path d="M17 6v12" />
    </svg>
  );
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [segments, setSegments] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const [segmentsResponse, bundlesResponse, vocabularyResponse] = await Promise.all([
          api.get("/segments/"),
          api.get("/lessons/"),
          api.get("/vocabulary/?page_size=500"),
        ]);
        setSegments(segmentsResponse.data);
        setBundles(bundlesResponse.data);
        setVocabulary(vocabularyResponse.data.results || []);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const totalWords = vocabulary.length;
  const fullBundles = bundles.filter((bundle) => bundle.is_full).length;
  const openBundles = bundles.length - fullBundles;
  const capacityUsed = bundles.length
    ? Math.round((totalWords / (bundles.length * 20)) * 100)
    : 0;

  const difficultyCounts = DIFFICULTIES.map((key) => ({
    key,
    count: vocabulary.filter((item) => item.difficulty === key).length,
  }));

  const bundlesBySegment = segments.map((segment) => {
    const segmentBundles = bundles.filter((bundle) => bundle.segment === segment.id);
    const segmentWords = segmentBundles.reduce((sum, bundle) => sum + bundle.vocabulary_count, 0);
    const segmentCapacity = segmentBundles.length * 20;
    return {
      ...segment,
      bundleCount: segmentBundles.length,
      wordCount: segmentWords,
      percent: segmentCapacity ? Math.round((segmentWords / segmentCapacity) * 100) : 0,
    };
  });

  const activeBundles = [...bundles]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  const recentWords = [...vocabulary]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <section className="admin-dashboard">
      <div className="admin-welcome">
        <div>
          <h2>{t("welcomeAdmin")}</h2>
          <p className="muted-text">{t("adminDashboardCopy")}</p>
        </div>
        <div className="button-row">
          <Link className="btn btn-outline" to="/admin/vocabulary/new">
            {t("addVocabulary")}
          </Link>
          <Link className="btn btn-primary" to="/admin/segments/new">
            {t("addSegment")}
          </Link>
        </div>
      </div>

      {error ? <p className="status-message error">{error}</p> : null}

      <div className="stat-grid">
        <article className="card stat-card-v2">
          <div className="stat-card-top">
            <span className="stat-label">{t("segments")}</span>
            <span className="stat-icon-badge"><IconSegments /></span>
          </div>
          <strong className="stat-value">{loading ? "—" : segments.length}</strong>
        </article>
        <article className="card stat-card-v2">
          <div className="stat-card-top">
            <span className="stat-label">{t("bundles")}</span>
            <span className="stat-icon-badge"><IconBundles /></span>
          </div>
          <strong className="stat-value">{loading ? "—" : bundles.length}</strong>
          <span className="stat-sub">
            {loading ? "" : `${openBundles} ${t("open")} · ${fullBundles} ${t("full")}`}
          </span>
        </article>
        <article className="card stat-card-v2">
          <div className="stat-card-top">
            <span className="stat-label">{t("vocabulary")}</span>
            <span className="stat-icon-badge"><IconWords /></span>
          </div>
          <strong className="stat-value">{loading ? "—" : totalWords}</strong>
          <span className="stat-sub">{loading ? "" : `${capacityUsed}% ${t("capacityUsed")}`}</span>
        </article>
        <article className="card stat-card-v2">
          <div className="stat-card-top">
            <span className="stat-label">{t("difficulty")}</span>
            <span className="stat-icon-badge"><IconChart /></span>
          </div>
          {loading ? (
            <strong className="stat-value">—</strong>
          ) : (
            <div className="difficulty-breakdown">
              {difficultyCounts.map(({ key, count }) => (
                <div className="difficulty-row" key={key}>
                  <span className={`pill difficulty-${key}`}>{t(key)}</span>
                  <span className="difficulty-count">{count}</span>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>

      <div className="admin-dashboard-grid">
        <div className="dashboard-section">
          <div className="section-heading">
            <h3>{t("recentSegments")}</h3>
            <Link className="text-link" to="/admin/segments">
              {t("manageSegments")}
            </Link>
          </div>

          {loading ? <p className="status-message">{t("loadingSegments")}</p> : null}

          {!loading && bundlesBySegment.length === 0 ? (
            <div className="empty-state card">
              <h3>{t("noSegmentsFound")}</h3>
              <p>{t("addFirstSegment")}</p>
              <Link className="btn btn-primary" to="/admin/segments/new">
                {t("addSegment")}
              </Link>
            </div>
          ) : null}

          {!loading && bundlesBySegment.length > 0 ? (
            <div className="segment-overview-list">
              {bundlesBySegment.map((segment) => (
                <Link
                  className="card segment-overview-row"
                  to={`/admin/segments/${segment.id}`}
                  key={segment.id}
                >
                  <div className="segment-overview-info">
                    <strong>{segment.name}</strong>
                    <span className="muted-text">
                      {segment.bundleCount} {t("bundles")} · {segment.wordCount} {t("words")}
                    </span>
                  </div>
                  <div className="bundle-progress segment-overview-progress">
                    <div className="bundle-progress-track">
                      <div
                        className={`bundle-progress-fill ${segment.percent >= 100 ? "complete" : ""}`}
                        style={{ width: `${Math.min(segment.percent, 100)}%` }}
                      />
                    </div>
                    <span className="bundle-progress-label">{segment.percent}% {t("capacityUsed")}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className="dashboard-side">
          <div className="card side-panel">
            <h3>{t("bundleStatus")}</h3>
            {loading ? <p className="status-message">{t("loadingBundles")}</p> : null}
            {!loading && activeBundles.length === 0 ? (
              <p className="muted-text">{t("noBundlesFound")}</p>
            ) : null}
            <ul className="side-list">
              {activeBundles.map((bundle) => (
                <li key={bundle.id}>
                  <Link to={`/admin/bundles/${bundle.id}`} className="side-list-link">
                    <span className="side-list-icon"><IconBundles /></span>
                    <span className="side-list-text">
                      <strong>{bundle.title}</strong>
                      <small>{bundle.vocabulary_count}/{bundle.capacity} {t("words")}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="card side-panel">
            <h3>{t("recentVocabulary")}</h3>
            {loading ? <p className="status-message">{t("loadingVocabulary")}</p> : null}
            {!loading && recentWords.length === 0 ? (
              <p className="muted-text">{t("noVocabularyYet")}</p>
            ) : null}
            <ul className="side-list">
              {recentWords.map((word) => (
                <li key={word.id}>
                  <Link to={`/admin/vocabulary/${word.id}`} className="side-list-link">
                    <span className="side-list-icon"><IconWords /></span>
                    <span className="side-list-text">
                      <strong>{word.word}</strong>
                      <small>{word.meaning}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
