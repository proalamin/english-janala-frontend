import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../language";

export default function LessonCard({ lesson, adminMode = false, onDelete, progress, showSegmentName = false }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const basePath = adminMode ? "/admin/bundles" : "/student/bundles";
  const detailPath = `${basePath}/${lesson.id}`;

  function openLesson() {
    navigate(detailPath);
  }

  function handleActionClick(event) {
    event.stopPropagation();
  }

  function handleDelete(event) {
    event.stopPropagation();
    onDelete?.(lesson);
  }

  return (
    <article
      className="card lesson-card clickable-card"
      onClick={openLesson}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLesson();
        }
      }}
    >
      <div className="card-header">
        <h3>
          {typeof lesson.serial === "number" ? (
            <span className="bundle-serial">#{lesson.serial}</span>
          ) : null}
          {lesson.title}
        </h3>
        {typeof lesson.vocabulary_count === "number" ? (
          <span className={`pill ${lesson.is_full ? "pill-full" : ""}`}>
            {lesson.vocabulary_count}/{lesson.capacity ?? 20} {t("words")}
          </span>
        ) : null}
      </div>
      {showSegmentName && lesson.segment_name ? (
        <span className="pill segment-pill">{lesson.segment_name}</span>
      ) : null}
      <p className="muted-text">
        {lesson.description || t("noDescription")}
      </p>
      {progress ? (
        <div className="bundle-progress">
          <div className="bundle-progress-track">
            <div
              className={`bundle-progress-fill ${progress.complete ? "complete" : ""}`}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="bundle-progress-label">
            {progress.complete
              ? t("bundleComplete")
              : `${progress.known}/${progress.total} ${t("wordsLearned")}`}
          </span>
        </div>
      ) : null}
      <div className="button-row" onClick={handleActionClick}>
        <Link className="btn btn-secondary" to={detailPath}>
          {t("viewVocabulary")}
        </Link>
        {adminMode ? (
          <Link className="btn btn-outline" to={`/admin/bundles/${lesson.id}/edit`}>
            {t("edit")}
          </Link>
        ) : null}
        {adminMode ? (
          <button
            className="btn btn-danger"
            type="button"
            onClick={handleDelete}
          >
            {t("delete")}
          </button>
        ) : null}
      </div>
    </article>
  );
}
