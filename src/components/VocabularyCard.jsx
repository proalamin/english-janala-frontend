import { Link, useNavigate } from "react-router-dom";

export default function VocabularyCard({
  item,
  showLessonTitle = true,
  adminMode = false,
  onDelete,
}) {
  const navigate = useNavigate();
  const detailPath = adminMode
    ? `/admin/vocabulary/${item.id}`
    : `/student/vocabulary/${item.id}`;

  function openVocabulary() {
    navigate(detailPath);
  }

  function handleActionClick(event) {
    event.stopPropagation();
  }

  function handleDelete(event) {
    event.stopPropagation();
    onDelete?.(item);
  }

  return (
    <article
      className="card vocabulary-card clickable-card"
      onClick={openVocabulary}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openVocabulary();
        }
      }}
    >
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
      <div className="button-row" onClick={handleActionClick}>
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
            onClick={handleDelete}
          >
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}
