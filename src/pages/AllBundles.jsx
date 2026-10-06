import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LessonCard from "../components/LessonCard";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

export default function AllBundles() {
  const { t } = useLanguage();
  const [segments, setSegments] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [segmentFilter, setSegmentFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const [segmentsResponse, bundlesResponse] = await Promise.all([
          api.get("/segments/"),
          api.get("/lessons/"),
        ]);
        setSegments(segmentsResponse.data);
        setBundles(bundlesResponse.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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

  const filteredBundles = segmentFilter
    ? bundles.filter((bundle) => String(bundle.segment) === segmentFilter)
    : bundles;

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{t("admin")}</span>
          <h2>{t("allBundles")}</h2>
          <p className="muted-text">{t("allBundlesCopy")}</p>
        </div>
        <Link
          className="btn btn-primary"
          to={segmentFilter ? `/admin/bundles/new?segment=${segmentFilter}` : "/admin/bundles/new"}
        >
          {t("addBundle")}
        </Link>
      </div>

      <div className="search-panel card">
        <label className="search-field difficulty-filter">
          <span>{t("segment")}</span>
          <select value={segmentFilter} onChange={(event) => setSegmentFilter(event.target.value)}>
            <option value="">{t("allSegments")}</option>
            {segments.map((segment) => (
              <option key={segment.id} value={segment.id}>
                {segment.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? <p className="status-message">{t("loadingBundles")}</p> : null}
      {error ? <p className="status-message error">{error}</p> : null}
      {message ? <p className="status-message success">{message}</p> : null}

      {!loading && !error && filteredBundles.length === 0 ? (
        <div className="empty-state card">
          <h3>{t("noBundlesFound")}</h3>
          <p>{t("noBundlesAvailable")}</p>
          <div className="button-row">
            <Link className="btn btn-primary" to="/admin/bundles/new">
              {t("addBundle")}
            </Link>
            <Link className="btn btn-outline" to="/admin/segments">
              {t("manageSegments")}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid two-column-grid">
        {filteredBundles.map((bundle) => (
          <LessonCard
            key={bundle.id}
            lesson={bundle}
            adminMode
            onDelete={deleteBundle}
            showSegmentName
          />
        ))}
      </div>
    </section>
  );
}
