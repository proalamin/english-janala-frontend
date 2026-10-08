import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LessonCard from "../components/LessonCard";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";
import { useAuth } from "../auth";
import { getBundleProgress } from "../progress";

export default function SegmentBundles({ adminMode = false }) {
  const { t } = useLanguage();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [segment, setSegment] = useState(null);
  const [bundles, setBundles] = useState([]);
  const [progressByBundle, setProgressByBundle] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const [segmentResponse, bundlesResponse] = await Promise.all([
          api.get(`/segments/${id}/`),
          api.get(`/segments/${id}/lessons/`),
        ]);
        setSegment(segmentResponse.data);
        setBundles(bundlesResponse.data);

        if (!adminMode) {
          if (isAuthenticated) {
            // The bundle list already carries known_count/progress_percent for the logged-in user.
            const entries = bundlesResponse.data.map((bundle) => [
              bundle.id,
              {
                known: bundle.known_count ?? 0,
                total: bundle.vocabulary_count,
                percent: bundle.progress_percent ?? 0,
                complete: bundle.vocabulary_count > 0 && bundle.known_count === bundle.vocabulary_count,
              },
            ]);
            setProgressByBundle(Object.fromEntries(entries));
          } else {
            const entries = await Promise.all(
              bundlesResponse.data.map(async (bundle) => {
                try {
                  const vocabResponse = await api.get(`/lessons/${bundle.id}/vocabulary/`);
                  const ids = vocabResponse.data.map((item) => item.id);
                  return [bundle.id, getBundleProgress(ids)];
                } catch {
                  return [bundle.id, null];
                }
              }),
            );
            setProgressByBundle(Object.fromEntries(entries));
          }
        }
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, adminMode, isAuthenticated]);

  async function deleteBundle(bundle) {
    const confirmed = window.confirm(
      `Delete bundle "${bundle.title}"? This works only when the bundle has no vocabulary.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");
      await api.delete(`/lessons/${bundle.id}/`);
      setBundles((current) => current.filter((item) => item.id !== bundle.id));
      setMessage("Bundle deleted successfully.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  const segmentComplete =
    !adminMode &&
    bundles.length > 0 &&
    bundles.every((bundle) => progressByBundle[bundle.id]?.complete);

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{adminMode ? t("admin") : t("segments")}</span>
          <h2>{segment ? segment.name : t("segments")}</h2>
          {segment?.description ? <p className="muted-text">{segment.description}</p> : null}
          {!adminMode && isAuthenticated && segment?.progress_percent != null ? (
            <div className="bundle-progress segment-progress-summary">
              <div className="bundle-progress-track">
                <div
                  className={`bundle-progress-fill ${segment.progress_percent >= 100 ? "complete" : ""}`}
                  style={{ width: `${segment.progress_percent}%` }}
                />
              </div>
              <span className="bundle-progress-label">
                {segment.known_count} {t("wordsLearned")} · {segment.progress_percent}%
              </span>
            </div>
          ) : null}
        </div>
        <div className="button-row">
          {adminMode ? (
            <Link className="btn btn-primary" to={`/admin/vocabulary/new?segment=${id}`}>
              {t("addVocabulary")}
            </Link>
          ) : null}
          {adminMode ? (
            <Link className="btn btn-outline" to={`/admin/bundles/new?segment=${id}`}>
              {t("addBundle")}
            </Link>
          ) : null}
          <Link className="btn btn-outline" to={adminMode ? "/admin/segments" : "/student/segments"}>
            {t("backToSegments")}
          </Link>
        </div>
      </div>

      {segmentComplete ? (
        <div className="status-message success segment-complete-banner">
          {t("segmentComplete")}
        </div>
      ) : null}

      {loading ? <p className="status-message">{t("loadingBundles")}</p> : null}
      {error ? <p className="status-message error">{error}</p> : null}
      {message ? <p className="status-message success">{message}</p> : null}

      {!loading && !error && bundles.length === 0 ? (
        <div className="empty-state card">
          <h3>{t("noBundlesFound")}</h3>
          <p>{adminMode ? t("addFirstBundle") : t("noBundlesAvailable")}</p>
          {adminMode ? (
            <Link className="btn btn-primary" to={`/admin/bundles/new?segment=${id}`}>
              {t("addBundle")}
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="grid two-column-grid">
        {bundles.map((bundle) => (
          <LessonCard
            key={bundle.id}
            lesson={bundle}
            adminMode={adminMode}
            onDelete={deleteBundle}
            progress={progressByBundle[bundle.id]}
          />
        ))}
      </div>
    </section>
  );
}
