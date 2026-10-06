import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SegmentCard from "../components/SegmentCard";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

export default function SegmentList({ adminMode = false }) {
  const { t } = useLanguage();
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchSegments() {
      try {
        const response = await api.get("/segments/");
        setSegments(response.data);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }

    fetchSegments();
  }, []);

  async function deleteSegment(segment) {
    const confirmed = window.confirm(
      `Delete segment "${segment.name}"? This works only when the segment has no bundles.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");
      await api.delete(`/segments/${segment.id}/`);
      setSegments((current) => current.filter((item) => item.id !== segment.id));
      setMessage("Segment deleted successfully.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{adminMode ? t("admin") : t("segments")}</span>
          <h2>{adminMode ? t("manageSegments") : t("allSegments")}</h2>
          <p className="muted-text">{t("segmentsCopy")}</p>
        </div>
        {adminMode ? (
          <Link className="btn btn-primary" to="/admin/segments/new">
            {t("addSegment")}
          </Link>
        ) : null}
      </div>

      {loading ? <p className="status-message">{t("loadingSegments")}</p> : null}
      {error ? <p className="status-message error">{error}</p> : null}
      {message ? <p className="status-message success">{message}</p> : null}

      {!loading && !error && segments.length === 0 ? (
        <div className="empty-state card">
          <h3>{t("noSegmentsFound")}</h3>
          <p>{adminMode ? t("addFirstSegment") : t("noSegmentsAvailable")}</p>
          {adminMode ? (
            <Link className="btn btn-primary" to="/admin/segments/new">
              {t("addSegment")}
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="grid two-column-grid">
        {segments.map((segment) => (
          <SegmentCard
            key={segment.id}
            segment={segment}
            adminMode={adminMode}
            onDelete={deleteSegment}
          />
        ))}
      </div>
    </section>
  );
}
