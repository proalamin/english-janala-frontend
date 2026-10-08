import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import VocabularyCard from "../components/VocabularyCard";
import LoginRequired from "../components/LoginRequired";
import { api, getApiErrorMessage } from "../api/axios";
import { useLanguage } from "../language";

export default function LessonVocabulary({ adminMode = false }) {
  const { t } = useLanguage();
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const lessonResponse = await api.get(`/lessons/${id}/`);
        setLesson(lessonResponse.data);
        const vocabularyResponse = await api.get(`/lessons/${id}/vocabulary/`);
        setVocabulary(vocabularyResponse.data);
      } catch (requestError) {
        if (requestError.response?.status === 403) {
          setLocked(true);
        } else {
          setError(getApiErrorMessage(requestError));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  async function deleteVocabulary(item) {
    const confirmed = window.confirm(`Delete vocabulary "${item.word}"?`);

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");
      await api.delete(`/vocabulary/${item.id}/`);
      setVocabulary((current) =>
        current.filter((vocabularyItem) => vocabularyItem.id !== item.id),
      );
      setMessage("Vocabulary deleted successfully.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError));
    }
  }

  if (loading) {
    return <p className="status-message">{t("loadingLessonVocabulary")}</p>;
  }

  if (locked) {
    return <LoginRequired />;
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">{adminMode ? t("admin") : t("lessonVocabulary")}</span>
          <h2>{lesson?.title || t("lesson")}</h2>
          {lesson?.description ? (
            <p className="muted-text">{lesson.description}</p>
          ) : null}
        </div>
        <div className="button-row">
          {!adminMode ? (
            <Link className="btn btn-primary" to={`/student/bundles/${id}/practice`}>
              {t("practiceVocabulary")}
            </Link>
          ) : null}
          {adminMode && lesson?.segment ? (
            <Link className="btn btn-primary" to={`/admin/vocabulary/new?segment=${lesson.segment}`}>
              {t("addVocabulary")}
            </Link>
          ) : null}
          <Link
            className="btn btn-outline"
            to={
              lesson?.segment
                ? `${adminMode ? "/admin/segments" : "/student/segments"}/${lesson.segment}`
                : adminMode
                  ? "/admin/segments"
                  : "/student/segments"
            }
          >
            {t("backToSegments")}
          </Link>
        </div>
      </div>

      {error ? <p className="status-message error">{error}</p> : null}
      {message ? <p className="status-message success">{message}</p> : null}

      {!error && vocabulary.length === 0 ? (
        <div className="empty-state card">
          <h3>{t("noVocabularyFound")}</h3>
          <p>{t("lessonNoVocabulary")}</p>
        </div>
      ) : null}

      <div className="grid two-column-grid">
        {vocabulary.map((item) => (
          <VocabularyCard
            key={item.id}
            item={item}
            showLessonTitle={false}
            adminMode={adminMode}
            onDelete={deleteVocabulary}
          />
        ))}
      </div>
    </section>
  );
}
