import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../language";

export default function SegmentCard({ segment, adminMode = false, onDelete }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const basePath = adminMode ? "/admin/segments" : "/student/segments";
  const detailPath = `${basePath}/${segment.id}`;

  function openSegment() {
    navigate(detailPath);
  }

  function handleActionClick(event) {
    event.stopPropagation();
  }

  function handleDelete(event) {
    event.stopPropagation();
    onDelete?.(segment);
  }

  return (
    <article
      className="card lesson-card clickable-card"
      onClick={openSegment}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openSegment();
        }
      }}
    >
      <div className="card-header">
        <h3>{segment.name}</h3>
        <span className="pill">
          {segment.bundle_count} {t("bundles")}
        </span>
      </div>
      <p className="muted-text">{segment.description || t("noDescription")}</p>
      {!adminMode && segment.progress_percent != null ? (
        <div className="bundle-progress">
          <div className="bundle-progress-track">
            <div
              className={`bundle-progress-fill ${segment.progress_percent >= 100 ? "complete" : ""}`}
              style={{ width: `${segment.progress_percent}%` }}
            />
          </div>
          <span className="bundle-progress-label">
            {segment.known_count}/{segment.total_words} {t("wordsLearned")}
          </span>
        </div>
      ) : null}
      <div className="button-row" onClick={handleActionClick}>
        <Link className="btn btn-secondary" to={detailPath}>
          {t("viewBundles")}
        </Link>
        {adminMode ? (
          <Link className="btn btn-outline" to={`/admin/segments/${segment.id}/edit`}>
            {t("edit")}
          </Link>
        ) : null}
        {adminMode ? (
          <button className="btn btn-danger" type="button" onClick={handleDelete}>
            {t("delete")}
          </button>
        ) : null}
      </div>
    </article>
  );
}
