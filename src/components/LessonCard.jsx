import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../language";

export default function LessonCard({ lesson, adminMode = false, onDelete }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const basePath = adminMode ? "/admin/lessons" : "/student/lessons";
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
        <h3>{lesson.title}</h3>
      </div>
      <p className="muted-text">
        {lesson.description || t("noDescription")}
      </p>
      <div className="button-row" onClick={handleActionClick}>
        <Link className="btn btn-secondary" to={detailPath}>
          {t("viewVocabulary")}
        </Link>
        {adminMode ? (
          <Link className="btn btn-outline" to={`/admin/lessons/${lesson.id}/edit`}>
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
