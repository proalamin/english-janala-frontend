import { Link } from "react-router-dom";

export default function VocabularyCard({
  item,
  showLessonTitle = true,
  adminMode = false,
  onDelete,
}) {
  const detailPath = adminMode
    ? `/admin/vocabulary/${item.id}`
    : `/student/vocabulary/${item.id}`;

  return (
    <article className="card vocabulary-card">
      <div className="card-header stack-left">
        <h3>{item.word}</h3>
        {showLessonTitle && <span className="pill">{item.lesson_title}</span>}
      </div>
      <p className="meaning-text">{item.meaning}</p>
      {item.pronunciation ? (
        <p className="detail-line">
          <strong>Pronunciation:</strong> {item.pronunciation}
        </p>
      ) : null}
      <div className="button-row">
        <Link className="btn btn-secondary" to={detailPath}>
          View Details
        </Link>
        {adminMode ? (
          <Link className="btn btn-outline" to={`/admin/vocabulary/${item.id}/edit`}>
            Edit
          </Link>
        ) : null}
        {adminMode ? (
          <button
            className="btn btn-danger"
            type="button"
            onClick={() => onDelete?.(item)}
          >
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}
