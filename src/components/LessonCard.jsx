import { Link } from "react-router-dom";

export default function LessonCard({ lesson, adminMode = false, onDelete }) {
  const basePath = adminMode ? "/admin/lessons" : "/student/lessons";

  return (
    <article className="card lesson-card">
      <div className="card-header">
        <h3>{lesson.title}</h3>
      </div>
      <p className="muted-text">
        {lesson.description || "No description added yet."}
      </p>
      <div className="button-row">
        <Link className="btn btn-secondary" to={`${basePath}/${lesson.id}`}>
          View Vocabulary
        </Link>
        {adminMode ? (
          <Link className="btn btn-outline" to={`/admin/lessons/${lesson.id}/edit`}>
            Edit
          </Link>
        ) : null}
        {adminMode ? (
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => onDelete?.(lesson)}
          >
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}
